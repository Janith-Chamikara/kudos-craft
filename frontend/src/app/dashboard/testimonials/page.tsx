import { Input } from '@/components/ui/input';
import { CreateWorkspaceForm } from '../components/CreateWorkspceFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Workspaces() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <div className="flex">
            <Input placeholder="Search..." className="w-64" />
            
          </div>
        </div>
        <ul className="flex flex-row gap-4 flex-wrap">
          {[
            {
              id: 1,
              name: 'Personal Projects',
              description: 'My personal workspace',
            },
            {
              id: 2,
              name: 'Team Alpha',
              description: 'Collaborative workspace for Team Alpha',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
            {
              id: 3,
              name: 'Client XYZ',
              description: 'Projects for Client XYZ',
            },
          ].map((workspace) => (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                  {workspace.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm ">{workspace.description}</div>
              </CardContent>
            </Card>
          ))}
        </ul>
      </div>
    </main>
  );
}
