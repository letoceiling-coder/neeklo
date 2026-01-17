import { z } from "zod";

export const briefFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Имя должно содержать минимум 2 символа" })
    .max(100, { message: "Имя не должно превышать 100 символов" }),
  company: z.string().trim().max(200).optional(),
  role: z
    .string()
    .trim()
    .min(2, { message: "Укажите вашу роль" })
    .max(100, { message: "Роль не должна превышать 100 символов" }),
  projectName: z.string().trim().max(200).optional(),
  description: z
    .string()
    .trim()
    .min(20, { message: "Описание должно содержать минимум 20 символов" })
    .max(2000, { message: "Описание не должно превышать 2000 символов" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, {
      message: "Введите корректный номер телефона",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Введите корректный email" })
    .max(255, { message: "Email не должен превышать 255 символов" }),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие на обработку персональных данных",
  }),
});

export type BriefFormData = z.infer<typeof briefFormSchema>;

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  url: string;
}
