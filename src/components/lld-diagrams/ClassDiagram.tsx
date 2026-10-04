import React from 'react';

export type RelationType = 'association' | 'aggregation' | 'composition' | 'inheritance' | 'implementation' | 'dependency';

export interface ClassMember {
  name: string;
  type?: string;
  isStatic?: boolean;
  visibility: 'public' | 'private' | 'protected';
}

export interface LldClass {
  id: string;
  name: string;
  attributes: ClassMember[];
  methods: ClassMember[];
}

export interface LldRelation {
  from: string;
  to: string;
  type: RelationType;
  label?: string;
}

export interface ClassDiagramSpec {
  classes: LldClass[];
  relations: LldRelation[];
}

export const ClassDiagram: React.FC<{ spec: ClassDiagramSpec }> = ({ spec }) => {
  // Simplified coordinates for a sample render
  const positions: Record<string, { x: number; y: number }> = {};
  spec.classes.forEach((c, i) => {
    positions[c.id] = { x: 100 + (i % 2) * 300, y: 50 + Math.floor(i / 2) * 200 };
  });

  return (
    <div className="lld-diagram lld-diagram--class">
      <svg width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
        {spec.relations.map((rel, i) => {
          const from = positions[rel.from];
          const to = positions[rel.to];
          if (!from || !to) return null;
          return (
            <line 
              key={i} 
              x1={from.x + 60} y1={from.y + 40} 
              x2={to.x + 60} y2={to.y + 40} 
              stroke="currentColor" strokeWidth="2" 
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        {spec.classes.map((c) => {
          const { x, y } = positions[c.id];
          return (
            <g key={c.id} transform={`translate(${x}, ${y})`}>
              <rect width="120" height="100" fill="var(--bg-card)" stroke="currentColor" strokeWidth="2" />
              <text x="60" y="20" textAnchor="middle" fontWeight="bold" fill="currentColor">{c.name}</text>
              <line x1="0" y1="25" x2="120" y2="25" stroke="currentColor" strokeWidth="1" />
              {c.attributes.map((attr, i) => (
                <text key={i} x="5" y={35 + i * 15} fontSize="10" fill="currentColor">
                  {attr.visibility === 'private' ? '-' : '+'} {attr.name}
                </text>
              ))}
              <line x1="0" y1={40 + c.attributes.length * 15} x2="120" y2={40 + c.attributes.length * 15} stroke="currentColor" strokeWidth="1" />
              {c.methods.map((m, i) => (
                <text key={i} x="5" y={55 + c.attributes.length * 15 + i * 15} fontSize="10" fill="currentColor">
                  {m.visibility === 'private' ? '-' : '+'} {m.name}()
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
