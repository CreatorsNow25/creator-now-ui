import { afterEach, describe, expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AccessGate from './AccessGate';

const originalStorage = globalThis.sessionStorage;

afterEach(() => {
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: originalStorage });
});

function renderPage(path, access) {
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: { getItem: () => access },
  });
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AccessGate />}>
          <Route path="*" element={<div>PRIVATE_PAGE_CONTENT</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('platform access-code gate', () => {
  test('direct page addresses cannot reveal pages without access-code approval', () => {
    for (const path of ['/', '/auth', '/real-auth', '/creator-dashboard', '/storyteller-dashboard', '/onboarding', '/reset-password', '/verify', '/email-verify', '/terms', '/privacy', '/unknown']) {
      expect(renderPage(path, null)).not.toContain('PRIVATE_PAGE_CONTENT');
    }
  });

  test('an unapproved access flag cannot reveal a page', () => {
    expect(renderPage('/auth', 'false')).not.toContain('PRIVATE_PAGE_CONTENT');
  });

  test('approved access preserves access to the requested page', () => {
    expect(renderPage('/auth', 'true')).toContain('PRIVATE_PAGE_CONTENT');
  });
});