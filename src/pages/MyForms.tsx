import { useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Seo from '@/components/Seo';
import { listForms } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';

const MyForms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    setForms(listForms());
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Seo title="My Forms | Form Builder" description="Browse saved forms and open previews." canonical={window.location.href} />
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">My Forms</h1>
        <Button variant="secondary" onClick={() => navigate('/create')}>Create New</Button>
      </header>

      {forms.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No forms yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Start by creating a form on the Create page.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {forms.map((f) => (
            <Card key={f.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{f.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Created on {new Date(f.createdAt).toLocaleString()}</div>
                <Button onClick={() => navigate(`/preview/${f.id}`)}>Open</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyForms;
