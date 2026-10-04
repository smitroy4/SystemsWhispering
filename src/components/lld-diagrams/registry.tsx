import { ClassDiagram } from './ClassDiagram.tsx';
import type { ClassDiagramSpec } from './ClassDiagram.tsx';

export type DiagramSpec = ClassDiagramSpec | any; // Extend with other diagram types later

export const diagramRegistry: Record<string, DiagramSpec> = {
  'sample-class-diagram': {
    classes: [
      {
        id: 'UserService',
        name: 'UserService',
        attributes: [
          { name: 'repo', visibility: 'private', type: 'UserRepository' },
          { name: 'emailer', visibility: 'private', type: 'EmailService' },
        ],
        methods: [
          { name: 'registerUser', visibility: 'public' },
        ],
      },
      {
        id: 'UserRepository',
        name: 'UserRepository',
        attributes: [],
        methods: [
          { name: 'save', visibility: 'public' },
        ],
      },
      {
        id: 'EmailService',
        name: 'EmailService',
        attributes: [],
        methods: [
          { name: 'sendWelcome', visibility: 'public' },
        ],
      },
    ],
    relations: [
      { from: 'UserService', to: 'UserRepository', type: 'association' },
      { from: 'UserService', to: 'EmailService', type: 'association' },
    ],
  },
};

export function renderDiagram(id: string) {
  const spec = diagramRegistry[id];
  if (!spec) return <div>Diagram {id} not found.</div>;

  // Determine which component to use based on the spec structure or a type field
  if ('classes' in spec && 'relations' in spec) {
    return <ClassDiagram spec={spec} />;
  }

  return <div>Unsupported diagram type for {id}.</div>;
}
