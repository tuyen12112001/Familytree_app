'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BaseEdge,
  Controls,
  Edge,
  EdgeProps,
  EdgeTypes,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeMouseHandler,
  NodeTypes,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { User } from 'lucide-react';

import PersonDetailPanel from '@/features/family-tree/PersonDetailPanel';
import { getYearOnly } from '@/lib/family-utils';
import { Person } from '@/types';

function VietnameseCornerOrnament({
  className,
  flipped = false,
}: {
  className?: string;
  flipped?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
    >
      <path d="M14 106C14 70 20 42 48 24C59 17 72 14 90 14" fill="none" stroke="rgba(180, 83, 9, 0.55)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M25 99C26 76 34 56 52 44" fill="none" stroke="rgba(180, 83, 9, 0.48)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 30C49 20 63 14 83 16" fill="none" stroke="rgba(180, 83, 9, 0.48)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M49 48C40 42 36 32 40 23C44 14 56 13 62 20C68 27 66 38 55 45" fill="none" stroke="rgba(180, 83, 9, 0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M69 32C80 21 93 19 101 27C108 35 104 48 92 53" fill="none" stroke="rgba(180, 83, 9, 0.52)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="33" cy="84" r="3.5" fill="rgba(180, 83, 9, 0.5)" />
      <circle cx="84" cy="18" r="3.5" fill="rgba(180, 83, 9, 0.5)" />
    </svg>
  );
}

function VietnameseCloud({
  className,
  flipped = false,
}: {
  className?: string;
  flipped?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 220 88"
      aria-hidden="true"
      className={className}
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
    >
      <path d="M12 60C24 60 28 48 40 48C48 48 56 54 56 62C56 67 53 72 48 74C59 73 67 66 67 57C67 47 58 39 47 39C51 34 53 29 53 24C53 14 45 8 35 8C24 8 16 15 16 26C16 32 19 38 24 42C11 45 4 53 4 63C4 74 13 82 25 82H70C82 82 90 75 90 65C90 57 83 51 74 50C83 48 89 41 89 33C89 22 80 14 69 14C61 14 54 18 50 25" fill="none" stroke="rgba(217, 119, 6, 0.5)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M107 70C120 70 125 58 136 58C144 58 151 64 151 72C151 77 148 81 144 83H188C200 83 208 76 208 66C208 56 200 49 190 49C194 44 196 39 196 34C196 24 188 17 178 17C167 17 159 24 159 35C159 38 160 42 162 45C149 47 141 55 141 65C141 67 141 69 142 70" fill="none" stroke="rgba(217, 119, 6, 0.42)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AncestralPlaque() {
  return (
    <div className="relative inline-flex items-center justify-center px-12 py-3">
      <div className="absolute inset-y-1 left-0 w-5 rounded-full bg-gradient-to-b from-amber-300 via-amber-600 to-amber-800 shadow-[inset_-2px_0_0_rgba(120,53,15,0.45)]" />
      <div className="absolute inset-y-1 right-0 w-5 rounded-full bg-gradient-to-b from-amber-300 via-amber-600 to-amber-800 shadow-[inset_2px_0_0_rgba(120,53,15,0.45)]" />
      <div className="absolute left-1 top-0 h-2 w-3 rounded-full bg-amber-200" />
      <div className="absolute right-1 top-0 h-2 w-3 rounded-full bg-amber-200" />
      <div className="absolute left-1 bottom-0 h-2 w-3 rounded-full bg-amber-700" />
      <div className="absolute right-1 bottom-0 h-2 w-3 rounded-full bg-amber-700" />

      <div className="relative min-w-[250px] rounded-sm border-2 border-yellow-300 bg-[#a61e16] px-12 py-3 text-center text-[#f6df8f] shadow-[0_8px_20px_rgba(120,53,15,0.18)]">
        <div className="absolute inset-x-2 top-1 h-[2px] bg-yellow-200/70" />
        <div className="absolute inset-x-2 bottom-1 h-[2px] bg-amber-800/35" />
        <div className="text-[11px] uppercase tracking-[0.38em] text-yellow-100/90">Dòng họ</div>
        <div className="mt-1 text-lg font-semibold uppercase tracking-[0.18em]">Nguyễn Văn</div>
      </div>
    </div>
  );
}

function CustomPersonNode({ data }: { data: { person: Person; isSelected: boolean } }) {
  const { person, isSelected } = data;
  const birthYear = getYearOnly(person.birthDate);
  const deathYear = person.deathDate && person.deathDate !== "Còn sống" ? getYearOnly(person.deathDate) || null : null;
  const yearRange = deathYear ? `${birthYear} - ${deathYear}` : `b. ${birthYear}`;
  const spouseHandlePosition = person.gender === 'male' ? Position.Right : Position.Left;

  return (
    <div
      className={`relative min-w-[148px] rounded-xl border-2 px-4 py-3 text-center shadow-md transition-all duration-200 ${
        isSelected
          ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-300'
          : 'border-amber-200 bg-white/95'
      }`}
    >
      <Handle
        id='target'
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 !border-2 !border-amber-700 !bg-amber-50"
      />

      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-300 overflow-hidden">
        {person.avatarUrl ? (
          <img
            src={person.avatarUrl}
            alt={person.fullName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-amber-700" />
        )}
      </div>

      <p className="text-xs font-semibold leading-tight text-slate-900">{person.fullName}</p>
      <p className="mt-1 text-xs text-slate-500">{yearRange}</p>

      <Handle
        id="spouse-target"
        type="target"
        position={spouseHandlePosition}
        className="!h-3 !w-3 !border-2 !border-amber-700 !bg-amber-50"
      />

      <Handle
        id="spouse-source"
        type="source"
        position={spouseHandlePosition}
        className="!h-3 !w-3 !border-2 !border-amber-700 !bg-amber-50"
      />

      <Handle
        id="source"
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 !border-2 !border-amber-700 !bg-amber-50"
      />
    </div>
  );
}

// Edge kiểu org-chart: thẳng dọc xuống từ cha → ngang → thẳng dọc xuống con
function OrgChartEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEnd }: EdgeProps) {
  const midY = (sourceY + targetY) / 2;
  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />;
}

function getGenerationLevels(peopleMap: Map<string, Person>) {
  const generationById = new Map<string, number>();

  function resolveGeneration(personId: string, visiting = new Set<string>()): number {
    if (generationById.has(personId)) {
      return generationById.get(personId)!;
    }

    if (visiting.has(personId)) {
      return 0;
    }

    visiting.add(personId);

    const person = peopleMap.get(personId);
    if (!person) {
      return 0;
    }

    const fatherLevel = person.fatherId ? resolveGeneration(person.fatherId, visiting) + 1 : 0;
    const motherLevel = person.motherId ? resolveGeneration(person.motherId, visiting) + 1 : 0;
    const level = Math.max(fatherLevel, motherLevel);

    generationById.set(personId, level);
    visiting.delete(personId);
    return level;
  }

  [...peopleMap.values()].forEach((person) => {
    resolveGeneration(person.id);
  });

  let changed = true;
  while (changed) {
    changed = false;

    [...peopleMap.values()].forEach((person) => {
      const ownLevel = generationById.get(person.id) ?? 0;

      person.spouseIds.forEach((spouseId) => {
        const spouseLevel = generationById.get(spouseId) ?? 0;
        const alignedLevel = Math.max(ownLevel, spouseLevel);

        if (generationById.get(person.id) !== alignedLevel) {
          generationById.set(person.id, alignedLevel);
          changed = true;
        }

        if (generationById.get(spouseId) !== alignedLevel) {
          generationById.set(spouseId, alignedLevel);
          changed = true;
        }
      });
    });
  }

  return generationById;
}

const NODE_W = 220;  // khoảng cách tối thiểu giữa 2 node
const GEN_H = 200;   // khoảng cách dọc giữa các thế hệ

function calculateNodePositions(peopleMap: Map<string, Person>) {
  const positions = new Map<string, { x: number; y: number }>();
  const generationById = getGenerationLevels(peopleMap);

  // Nhóm người theo thế hệ
  const peopleByGeneration = new Map<number, Person[]>();
  [...peopleMap.values()].forEach((person) => {
    const gen = generationById.get(person.id) ?? 0;
    const arr = peopleByGeneration.get(gen) ?? [];
    arr.push(person);
    peopleByGeneration.set(gen, arr);
  });

  const orderedGenerations = [...peopleByGeneration.keys()].sort((a, b) => a - b);

  // Tạo nhóm vợ/chồng trong cùng thế hệ
  const buildSpouseGroups = (people: Person[]): Person[][] => {
    const peopleIds = new Set(people.map(p => p.id));
    const visited = new Set<string>();
    const groups: Person[][] = [];
    const collect = (person: Person, group: Person[]) => {
      if (visited.has(person.id)) return;
      visited.add(person.id);
      group.push(person);
      person.spouseIds.forEach(sid => {
        if (peopleIds.has(sid)) {
          const s = peopleMap.get(sid);
          if (s) collect(s, group);
        }
      });
    };
    people.forEach(person => {
      if (visited.has(person.id)) return;
      const group: Person[] = [];
      collect(person, group);
      // Trong nhóm: nam trước nữ, cùng giới → theo ngày sinh
      group.sort((a, b) => {
        if (a.gender !== b.gender) return a.gender === 'male' ? -1 : 1;
        return a.birthDate.replace(/[*?]/g, '0').localeCompare(b.birthDate.replace(/[*?]/g, '0'));
      });
      groups.push(group);
    });
    return groups;
  };

  // Người "chính" của nhóm = người có cha/mẹ trong cây
  const getMainPerson = (group: Person[]): Person =>
    group.find(p => p.fatherId || p.motherId) ?? group[0];

  // Lấy X của cha (các con luôn canh theo cha, không lấy trung điểm cha-mẹ)
  const getCoupleCenterX = (person: Person): number | null => {
    const fX = person.fatherId ? positions.get(person.fatherId)?.x : undefined;
    const mX = person.motherId ? positions.get(person.motherId)?.x : undefined;
    if (fX !== undefined) return fX; // Luôn dùng vị trí X của cha
    if (mX !== undefined) return mX; // Fallback: chỉ có mẹ
    return null;
  };

  orderedGenerations.forEach((generation) => {
    const people = peopleByGeneration.get(generation) ?? [];
    const y = generation * GEN_H;
    const spouseGroups = buildSpouseGroups(people);
    if (spouseGroups.length === 0) return;

    // Kiểm tra thế hệ gốc (không ai có cha/mẹ trong cây)
    const isRoot = spouseGroups.every(g => {
      const m = getMainPerson(g);
      return !m.fatherId && !m.motherId;
    });

    if (isRoot) {
      // Thế hệ gốc: dàn đều quanh x=0
      const totalNodes = spouseGroups.reduce((s, g) => s + g.length, 0);
      const totalWidth = (totalNodes - 1) * NODE_W;
      let x = -totalWidth / 2;
      spouseGroups.forEach(group => {
        group.forEach(person => {
          positions.set(person.id, { x, y });
          x += NODE_W;
        });
      });
      return;
    }

    // Thế hệ có cha/mẹ:
    // 1. Gom nhóm vợ/chồng theo cha chung (fatherId của người chính)
    const siblingClusters = new Map<string, Person[][]>(); // parentKey → [spouseGroup,...]
    const orphanGroups: Person[][] = []; // nhóm không có cha/mẹ trong cây (vợ/chồng từ ngoài vào)
    spouseGroups.forEach(group => {
      const main = getMainPerson(group);
      const pk = main.fatherId ?? main.motherId;
      if (pk) {
        const arr = siblingClusters.get(pk) ?? [];
        arr.push(group);
        siblingClusters.set(pk, arr);
      } else {
        orphanGroups.push(group);
      }
    });

    // 2. Sắp xếp trong mỗi cluster theo birthDate của người chính (con trưởng → trái)
    siblingClusters.forEach(cluster =>
      cluster.sort((gA, gB) => {
        const rA = getMainPerson(gA);
        const rB = getMainPerson(gB);
        return rA.birthDate.replace(/[*?]/g, '0').localeCompare(rB.birthDate.replace(/[*?]/g, '0'));
      })
    );

    // 3. Sắp xếp các cluster theo birthDate của cha (nhánh trưởng → trái)
    const sortedClusterKeys = [...siblingClusters.keys()].sort((pkA, pkB) => {
      const pA = peopleMap.get(pkA);
      const pB = peopleMap.get(pkB);
      if (!pA || !pB) return 0;
      return pA.birthDate.replace(/[*?]/g, '0').localeCompare(pB.birthDate.replace(/[*?]/g, '0'));
    });

    // 4. Với mỗi cluster, spread các nhóm đều quanh center của cha/mẹ
    const groupCenterX = new Map<Person[], number>();

    sortedClusterKeys.forEach(pk => {
      const cluster = siblingClusters.get(pk)!;
      // Tính center của cặp cha/mẹ
      const main = getMainPerson(cluster[0]);
      const parentCX = getCoupleCenterX(main) ?? 0;

      // Tổng width: mỗi nhóm chiếm (size-1)*NODE_W, giữa các nhóm cách NODE_W
      const totalW = cluster.reduce((sum, g) => sum + (g.length - 1) * NODE_W, 0)
        + Math.max(0, cluster.length - 1) * NODE_W;
      let x = parentCX - totalW / 2;
      cluster.forEach(group => {
        const gw = (group.length - 1) * NODE_W;
        groupCenterX.set(group, x + gw / 2);
        x += gw + NODE_W;
      });
    });

    // Orphan groups: đặt tạm dựa trên vị trí của vợ/chồng đã có
    orphanGroups.forEach(group => {
      const main = getMainPerson(group);
      const existingSpouseGroup = [...siblingClusters.values()].flat()
        .find(g => g.some(p => main.spouseIds.includes(p.id)));
      if (existingSpouseGroup) {
        groupCenterX.set(group, groupCenterX.get(existingSpouseGroup) ?? 0);
      } else {
        groupCenterX.set(group, 0);
      }
    });

    // 5. Thứ tự hiển thị: cluster1[...] cluster2[...] ... orphans
    const orderedGroups: Person[][] = [
      ...sortedClusterKeys.flatMap(pk => siblingClusters.get(pk) ?? []),
      ...orphanGroups,
    ];

    // 6. Resolve overlap từ trái sang phải (min gap = NODE_W)
    const cx: number[] = orderedGroups.map(g => groupCenterX.get(g) ?? 0);
    for (let i = 1; i < orderedGroups.length; i++) {
      const prevRight = cx[i - 1] + (orderedGroups[i - 1].length - 1) * NODE_W / 2;
      const curWidth = (orderedGroups[i].length - 1) * NODE_W;
      const curLeft = cx[i] - curWidth / 2;
      if (curLeft < prevRight + NODE_W) {
        cx[i] = prevRight + NODE_W + curWidth / 2;
      }
    }

    // 7. Gán vị trí cuối
    orderedGroups.forEach((group, gi) => {
      const startX = cx[gi] - (group.length - 1) * NODE_W / 2;
      group.forEach((person, pi) => {
        positions.set(person.id, { x: startX + pi * NODE_W, y });
      });
    });
  });

  return positions;
}

function createEdges(people: Person[]) {
  const edgeList: Edge[] = [];
  const addedEdgeIds = new Set<string>();

  people.forEach((person) => {
    if (person.fatherId) {
      const edgeId = `${person.fatherId}->${person.id}`;
      if (!addedEdgeIds.has(edgeId)) {
        edgeList.push({
          id: edgeId,
          source: person.fatherId,
          target: person.id,
          sourceHandle: 'source',
          targetHandle: 'target',
          type: 'orgChart',
          style: { stroke: '#64748b', strokeWidth: 2.5 },
          // markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
        });
        addedEdgeIds.add(edgeId);
      }
    }

    // if (person.motherId) {
    //   const edgeId = `${person.motherId}->${person.id}`;
    //   if (!addedEdgeIds.has(edgeId)) {
    //     edgeList.push({
    //       id: edgeId,
    //       source: person.motherId,
    //       target: person.id,
    //       sourceHandle: 'source',
    //       targetHandle: 'target',
    //       type: 'smoothstep',
    //       style: { stroke: '#db2777', strokeWidth: 2.5 },
    //       markerEnd: { type: MarkerType.ArrowClosed, color: '#db2777' },
    //     });
    //     addedEdgeIds.add(edgeId);
    //   }
    // }

    person.spouseIds.forEach((spouseId) => {
      const edgeId = [person.id, spouseId].sort().join('<->');
      if (!addedEdgeIds.has(edgeId)) {
        edgeList.push({
          id: edgeId,
          source: person.id,
          target: spouseId,
          sourceHandle: 'spouse-source',
          targetHandle: 'spouse-target',
          type: 'straight',
          animated: true,
          style: {
            stroke: '#d97706',
            strokeWidth: 2,
            strokeDasharray: '8 6',
          },
        });
        addedEdgeIds.add(edgeId);
      }
    });
  });

  return edgeList;
}

export default function FamilyTreePage() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch('/api/people')
      .then(res => res.json())
      .then((data: Person[]) => {
        setPeople(data);
        setLoadingPeople(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách:', err);
        setLoadingPeople(false);
      });
  }, []);

  const peopleMap = useMemo(() => {
    const map = new Map<string, Person>();
    people.forEach((person) => map.set(person.id, person));
    return map;
  }, [people]);

  const positions = useMemo(() => calculateNodePositions(peopleMap), [peopleMap]);

  const nodes = useMemo<Node[]>(
    () =>
      people.map((person) => ({
        id: person.id,
        data: { person, isSelected: selectedPersonId === person.id },
        position: positions.get(person.id) ?? { x: 0, y: 0 },
        type: 'customPerson',
      })),
    [people, positions, selectedPersonId]
  );

  const edges = useMemo(() => createEdges(people), [people]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    setFlowNodes(nodes);
  }, [nodes, setFlowNodes]);

  useEffect(() => {
    setFlowEdges(edges);
  }, [edges, setFlowEdges]);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      customPerson: CustomPersonNode,
    }),
    []
  );

  const edgeTypes: EdgeTypes = useMemo(() => ({ orgChart: OrgChartEdge }), []);

  const handleNodeClick = useCallback<NodeMouseHandler>((_event, node) => {
    setSelectedPersonId(node.id);
  }, []);

  const selectedPerson = selectedPersonId ? peopleMap.get(selectedPersonId) : null;

  if (loadingPeople) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-[#f6d67a]">
        <p className="text-amber-800 text-lg font-medium">Đang tải cây gia phả...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden bg-[#f6d67a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-[18px] rounded-[28px] border border-amber-700/30 bg-[#f8df95]" />
        <div className="absolute inset-[30px] rounded-[24px] border border-amber-700/35" />
        <div className="absolute inset-[30px] bg-[radial-gradient(circle_at_center,_rgba(255,248,220,0.18)_0%,_rgba(255,248,220,0.18)_8%,_transparent_8%)] bg-[length:22px_22px] opacity-20" />
        <div className="absolute inset-x-[9%] top-[14%] bottom-[10%] opacity-[0.14]">
          <div className="absolute left-1/2 top-[8%] h-[62%] w-5 -translate-x-1/2 rounded-full bg-amber-800/60" />
          <div className="absolute left-1/2 top-[20%] h-1 w-[54%] -translate-x-[4%] rotate-[20deg] rounded-full bg-amber-800/50" />
          <div className="absolute left-1/2 top-[24%] h-1 w-[54%] -translate-x-[96%] -rotate-[20deg] rounded-full bg-amber-800/50" />
          <div className="absolute left-[22%] top-[33%] h-1 w-[26%] rotate-[24deg] rounded-full bg-amber-800/45" />
          <div className="absolute right-[22%] top-[33%] h-1 w-[26%] -rotate-[24deg] rounded-full bg-amber-800/45" />
          <div className="absolute left-[16%] top-[44%] h-1 w-[22%] rotate-[18deg] rounded-full bg-amber-800/40" />
          <div className="absolute right-[16%] top-[44%] h-1 w-[22%] -rotate-[18deg] rounded-full bg-amber-800/40" />
          <div className="absolute left-[10%] top-[55%] h-1 w-[18%] rotate-[12deg] rounded-full bg-amber-800/35" />
          <div className="absolute right-[10%] top-[55%] h-1 w-[18%] -rotate-[12deg] rounded-full bg-amber-800/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(146,64,14,0.35)_0%,_rgba(146,64,14,0.35)_28%,_transparent_30%)] bg-[length:84px_84px] [mask-image:radial-gradient(circle_at_center,black_20%,transparent_78%)]" />
        </div>
        <VietnameseCornerOrnament className="absolute left-[34px] top-[34px] h-20 w-20" />
        <VietnameseCornerOrnament className="absolute right-[34px] top-[34px] h-20 w-20" flipped />
        <VietnameseCornerOrnament className="absolute bottom-[34px] left-[34px] h-20 w-20 rotate-180" />
        <VietnameseCornerOrnament className="absolute bottom-[34px] right-[34px] h-20 w-20" flipped />
        <VietnameseCloud className="absolute left-[6%] top-[34px] h-16 w-40 opacity-60" />
        <VietnameseCloud className="absolute right-[6%] top-[34px] h-16 w-40 opacity-60" flipped />
      </div>

      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-5">
          <AncestralPlaque />
        </div>

        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{
            type: 'orgChart',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 18,
              height: 18,
            },
          }}
        >
          <Background color="rgba(146, 64, 14, 0.08)" gap={28} size={0.9} />
          <Controls />
          <MiniMap
            pannable
            zoomable
            maskColor="rgba(255, 251, 235, 0.78)"
            nodeColor={(node) => (node.id === selectedPersonId ? '#d97706' : '#fbbf24')}
            style={{
              backgroundColor: 'rgba(255, 251, 235, 0.95)',
              border: '1px solid rgba(180, 83, 9, 0.25)',
            }}
          />
        </ReactFlow>
      </div>

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
