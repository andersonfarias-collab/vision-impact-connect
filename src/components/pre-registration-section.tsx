import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Mail, User, Briefcase, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from 'react-i18next';
import { sanitizeString, sanitizeEmail, sanitizePhone, validateEmail, validatePhone, validateName } from "@/utils/sanitization";

export const PreRegistrationSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(formData.name),
      email: sanitizeEmail(formData.email),
      phone: sanitizePhone(formData.phone),
      role: sanitizeString(formData.role)
    };
    
    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.phone || !sanitizedData.role) {
      toast({
        title: t('pre_registration.messages.required_fields_title'),
        description: t('pre_registration.errors.required_fields'),
        variant: "destructive"
      });
      return;
    }

    // Validate input formats
    if (!validateName(sanitizedData.name)) {
      toast({
        title: t('pre_registration.messages.invalid_name_title'),
        description: t('pre_registration.errors.invalid_name'),
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(sanitizedData.email)) {
      toast({
        title: t('pre_registration.messages.invalid_email_title'),
        description: t('pre_registration.errors.invalid_email'),
        variant: "destructive"
      });
      return;
    }

    if (!validatePhone(sanitizedData.phone)) {
      toast({
        title: t('pre_registration.messages.invalid_phone_title'),
        description: t('pre_registration.errors.invalid_phone'),
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pre_registrations')
        .insert([sanitizedData]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast({
        title: t('pre_registration.messages.success_title'),
        description: t('pre_registration.messages.success_message'),
        variant: "default"
      });
    } catch (error) {
      toast({
        title: t('pre_registration.messages.error_title'),
        description: t('pre_registration.errors.registration_error'),
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-sustainability">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl animate-fade-in">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('pre_registration.success.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('pre_registration.success.message')}
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setIsSubmitted(false)}
              >
                {t('pre_registration.success.register_another')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="pre-registration" className="py-24 bg-gradient-sustainability">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl animate-fade-in">
          <CardHeader className="text-center pb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('pre_registration.title')}
            </h2>
            <p className="text-2xl font-semibold text-accent mb-4">
              {t('pre_registration.subtitle')}
            </p>
            <div className="bg-accent/10 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
              <p className="text-accent font-semibold mb-2">{t('pre_registration.platform_development')}</p>
              <p className="text-muted-foreground">
                {t('pre_registration.development_description')}
              </p>
              <ul className="text-muted-foreground text-sm mt-3 space-y-1">
                <li>• {t('pre_registration.benefits.0')}</li>
                <li>• {t('pre_registration.benefits.1')}</li>
                <li>• {t('pre_registration.benefits.2')}</li>
              </ul>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('pre_registration.form.full_name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('pre_registration.form.full_name_placeholder')}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('pre_registration.form.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('pre_registration.form.email_placeholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('pre_registration.form.phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('pre_registration.form.phone_placeholder')}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12 text-base"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t('pre_registration.form.phone_format')}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {t('pre_registration.form.role')}
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger 
                    className="h-12 text-base"
                    aria-label={t('pre_registration.form.role')}
                  >
                    <SelectValue placeholder={t('pre_registration.form.role_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneur">{t('pre_registration.form.entrepreneur')}</SelectItem>
                    <SelectItem value="investor">{t('pre_registration.form.investor')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="cta" 
                  size="lg" 
                  className="w-full h-14 text-xl"
                >
                  {t('pre_registration.form.submit')}
                </Button>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {t('pre_registration.form.terms')}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};