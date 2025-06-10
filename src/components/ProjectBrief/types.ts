
export interface ProjectFormData {
  title: string;
  genre: string;
  budget: [number];
  description: string;
  deadline: string;
  style: string;
  duration: string;
  scriptFile: File | null;
}

export interface ProjectBriefFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export interface StepProps {
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
}
