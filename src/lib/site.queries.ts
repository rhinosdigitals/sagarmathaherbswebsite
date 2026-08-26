import { queryOptions } from "@tanstack/react-query";
import { getSiteData } from "./site.functions";

export const siteDataQuery = queryOptions({
  queryKey: ["site-data"],
  queryFn: () => getSiteData(),
  staleTime: 30_000,
});
