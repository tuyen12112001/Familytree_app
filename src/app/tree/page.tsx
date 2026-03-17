'use client';

import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { mockPeople } from '@/data/mock-family';
import { Person } from '@/types';
import { getYearOnly } from '@/lib/family-utils';
import PersonDetailPanel from '@/features/family-tree/PersonDetailPanel';
import FamilyTreeNode from '@/components/FamilyTreeNode';
import { User } from 'lucide-react';

// Custom node component
function CustomPersonNode({ data }: { data: { person: Person; isSelected: boolean } }) {
  const { person, isSelected } = data;
  const birthYear = getYearOnly(person.birthDate);
  const deathYear = person.deathDate ? getYearOnly(person.deathDate) : null;
  const yearRange = deathYear ? `${birthYear} - ${deathYear}` : `b. ${birthYear}`;

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 bg-white shadow-md
        transition-all duration-200 min-w-[140px] text-center
        ${isSelected 
          ? 'border-amber-600 ring-2 ring-amber-300 bg-amber-50' 
          : 'border-slate-200'
        }
      `}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center mb-2 mx-auto">
        <User className="w-5 h-5 text-amber-700" />
      </div>
      <p className="text-xs font-semibold text-slate-900 leading-tight">
        {person.fullName}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {yearRange}
      </p>
    </div>
  );
}

// Calculate generation level
function getGenerationLevel(personId: string, peopleMap: Map<string, Person>): number {
  const visited = new Set<string>();

  function getAncestorDepth(id: string): number {
    if (visited.has(id)) return 0;
    visited.add(id);

    const person = peopleMap.get(id);
    if (!person) return 0;

    const fatherDepth = person.fatherId ? getAncestorDepth(person.fatherId) + 1 : 0;
    const motherDepth = person.motherId ? getAncestorDepth(person.motherId) + 1 : 0;

    return Math.max(fatherDepth, motherDepth);
  }

  return getAncestorDepth(personId);
}

// Calculate positions in grid
function calculateNodePositions(
  peopleMap: Map<string, Person>
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const generationMap = new Map<number, string[]>();

  // Group people by generation
  mockPeople.forEach(person => {
    const gen = getGenerationLevel(person.id, peopleMap);
    if (!generationMap.has(gen)) {
      generationMap.set(gen, []);
    }
    generationMap.get(gen)!.push(person.id);
  });

  // Position nodes
  const maxGen = Math.max(...generationMap.keys());
  generationMap.forEach((peopleIds, gen) => {
    const y = (maxGen - gen) * 150;
    peopleIds.forEach((id, index) => {
      const x = (index - peopleIds.length / 2) * 200;
      positions.set(id, { x, y });
    });
  });

  return positions;
}

export default function FamilyTreePage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const peopleMap = useMemo(() => {
    const map = new Map<string, Person>();
    mockPeople.forEach(person => map.set(person.id, person));
    return map;
  }, []);

  // Calculate positions
  const positions = useMemo(
    () => calculateNodePositions(peopleMap),
    [peopleMap]
  );

  // Create nodes
  const nodes: Node[] = useMemo(
    () =>
      mockPeople.map(person => {
        const pos = positions.get(person.id) || { x: 0, y: 0 };
        return {
          id: person.id,
          data: { person, isSelected: selectedPersonId === person.id },
          position: pos,
          type: 'customPerson',
        };
      }),
    [positions, selectedPersonId]
  );

  // Create edges
  const edges: Edge[] = useMemo(() => {
    const edgeArray: Edge[] = [];
    const addedEdges = new Set<string>();

    mockPeople.forEach(person => {
      // Father connection
      if (person.fatherId) {
        const edgeId = `${person.fatherId}->${person.id}`;
        if (!addedEdges.has(edgeId)) {
          edgeArray.push({
            id: edgeId,
            source: person.fatherId,
            target: person.id,
            type: 'smoothstep',
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          });
          addedEdges.add(edgeId);
        }
      }

      // Mother connection
      if (person.motherId) {
        const edgeId = `${person.motherId}->${person.id}`;
        if (!addedEdges.has(edgeId)) {
          edgeArray.push({
            id: edgeId,
            source: person.motherId,
            target: person.id,
            type: 'smoothstep',
            style: { stroke: '#f472b6', strokeWidth: 2 },
          });
          addedEdges.add(edgeId);
        }
      }
    });

    return edgeArray;
  }, []);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);

  // Update flow nodes when nodes change
  useState(() => {
    setFlowNodes(nodes);
  });

  useState(() => {
    setFlowEdges(edges);
  });

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      customPerson: CustomPersonNode,
    }),
    []
  );

  const handleNodeClick = useCallback((event: any, node: Node) => {
    setSelectedPersonId(node.id);
  }, []);

  const selectedPerson = selectedPersonId ? peopleMap.get(selectedPersonId) : null;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* React Flow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#e2e8f0" style={{ backgroundColor: '#f8fafc' }} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Right Panel - Person Details */}
      {selectedPerson && (
        <PersonDetailPanel
          person={selectedPerson}
          peopleMap={peopleMap}
          onClose={() => setSelectedPersonId(null)}
        />
      )}
    </div>
  );
}
