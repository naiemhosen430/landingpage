export type PageViewRecord = {
  projectId: string;
  visitorId?: string;
  recordedAt: string;
};

const pageViews: PageViewRecord[] = [];
const projectSet = new Set<string>();

export function addPageView(projectId: string, visitorId?: string) {
  projectSet.add(projectId);
  pageViews.push({
    projectId,
    visitorId,
    recordedAt: new Date().toISOString(),
  });
}

export function getPageViewStats(
  projectId: string,
  from?: string,
  to?: string,
) {
  const fromTs = from ? new Date(from).getTime() : 0;
  const toTs = to ? new Date(to).getTime() : Date.now();
  const filtered = pageViews.filter((record) => {
    if (record.projectId !== projectId) return false;
    const ts = new Date(record.recordedAt).getTime();
    return ts >= fromTs && ts <= toTs;
  });
  const totalPageViews = filtered.length;
  const uniqueVisitors = new Set(
    filtered
      .filter((record) => record.visitorId)
      .map((record) => record.visitorId),
  ).size;
  const daily = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const day = date.toISOString().slice(0, 10);
    return {
      date: day,
      views: filtered.filter((record) => record.recordedAt.slice(0, 10) === day)
        .length,
    };
  });

  return { totalPageViews, totalUniqueVisitors: uniqueVisitors, daily };
}

export function getPlatformProjectCounts() {
  return {
    totalProjects: projectSet.size,
    activeProjects: projectSet.size,
  };
}
