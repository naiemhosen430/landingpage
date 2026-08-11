export type TrackingEventRecord = {
  id: string;
  projectId: string;
  eventType: string;
  eventName: string;
  payload: any;
  sessionId?: string;
  visitorId?: string;
  url?: string;
  referrer?: string;
  forwarded?: boolean;
  forwardedAt?: string;
  createdAt: string;
};

const events: TrackingEventRecord[] = [];

const makeId = () => Math.random().toString(36).slice(2, 12);

export function addTrackingEvent(
  data: Omit<
    TrackingEventRecord,
    "id" | "createdAt" | "forwarded" | "forwardedAt"
  >,
) {
  const event: TrackingEventRecord = {
    ...data,
    id: makeId(),
    createdAt: new Date().toISOString(),
    forwarded: false,
  };
  events.unshift(event);
  return event;
}

export function getTrackingEvents({
  page = 1,
  limit = 20,
  eventType,
  eventName,
  forwarded,
}: {
  page?: number;
  limit?: number;
  eventType?: string;
  eventName?: string;
  forwarded?: boolean;
}) {
  let filtered = events;
  if (eventType) {
    filtered = filtered.filter((event) => event.eventType === eventType);
  }
  if (eventName) {
    filtered = filtered.filter((event) => event.eventName === eventName);
  }
  if (typeof forwarded === "boolean") {
    filtered = filtered.filter((event) => event.forwarded === forwarded);
  }

  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);
  return {
    data: paginated,
    meta: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasNextPage: offset + limit < filtered.length,
      hasPrevPage: page > 1,
    },
  };
}

export function getTrackingEventById(id: string) {
  return events.find((event) => event.id === id) || null;
}

export function deleteTrackingEvent(id: string) {
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return false;
  events.splice(index, 1);
  return true;
}

export function forwardPendingEvents() {
  const pending = events.filter((event) => !event.forwarded);
  pending.forEach((event) => {
    event.forwarded = true;
    event.forwardedAt = new Date().toISOString();
  });
  return pending.length;
}
