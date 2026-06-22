import BrandPanel from "@/components/login/layout/BrandPanel";
import FormPanel from "@/components/login/layout/FormPanel";
import AuthForms from "@/components/login/AuthForms";

export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <BrandPanel />
      <FormPanel>
        <AuthForms />
      </FormPanel>
    </div>
  );
}