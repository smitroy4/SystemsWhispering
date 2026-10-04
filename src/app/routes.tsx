import { Route, Routes } from 'react-router-dom';
import {
  AlgorithmDetailPage,
  AlgorithmsPage,
  ConceptDetailPage,
  ConceptsPage,
  DataStructureDetailPage,
  DataStructuresPage,
  DevVizPage,
  HomePage,
  LldPage,
  LldTopicPage,
  NotFoundPage,
  ProblemsPage,
  SheetDetailPage,
  SheetsPage,
} from '../pages/index.ts';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/data-structures" element={<DataStructuresPage />} />
      <Route path="/data-structures/:slug" element={<DataStructureDetailPage />} />
      <Route path="/algorithms" element={<AlgorithmsPage />} />
      <Route path="/algorithms/:slug" element={<AlgorithmDetailPage />} />
      <Route path="/concepts" element={<ConceptsPage />} />
      <Route path="/concepts/:slug" element={<ConceptDetailPage />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/sheets" element={<SheetsPage />} />
      <Route path="/sheets/:slug" element={<SheetDetailPage />} />
      <Route path="/lld" element={<LldPage />} />
      <Route path="/lld/:module/:topic" element={<LldTopicPage />} />
      <Route path="/dev/viz" element={<DevVizPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
