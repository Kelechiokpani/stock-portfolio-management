import { baseApi } from "../../api";

export interface ReferenceItem {
  id: string;
  name: string;
  code?: string;
}

export const referenceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<ReferenceItem[], void>({
      query: () => "/reference/locations",
      transformResponse: (response: { data: ReferenceItem[] }) => response.data,
    }),
    getGenders: builder.query<ReferenceItem[], void>({
      query: () => "/reference/genders",
      transformResponse: (response: { data: ReferenceItem[] }) => response.data,
    }),
  }),
});

export const { useGetLocationsQuery, useGetGendersQuery } = referenceApi;