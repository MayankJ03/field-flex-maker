import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Seo title="Form Builder | Create, Preview, Save" description="Build dynamic forms with validations and derived fields. Preview and manage your saved forms." canonical={window.location.href} />
      <div className="text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">Build Dynamic Forms Fast</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Create forms with validations, derived fields, and live preview. Everything saved locally—no backend needed.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button onClick={() => navigate('/create')}>Start Building</Button>
            <Button variant="secondary" onClick={() => navigate('/myforms')}>My Forms</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Create</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Add fields (text, number, select, etc.), set rules, and define derived values.</CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Test inputs with validations and watch derived fields auto-update.</CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Save</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Persist form schemas in your browser and reopen anytime.</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
