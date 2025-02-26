import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CatModel } from "../types/cats";
import getAvgLifeSpan from "../tools/getAvgLifeSpan";
import isLapCat from "../tools/isLapCat";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
});

const baseQueryWithRetry = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object, retries = 1) => {
  let result = await baseQuery(args, api, extraOptions);
  let attempt = 0;

  while (result.error && attempt < retries) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);
    attempt++;
  }

  return result;
};

export const catsApi = createApi({
  reducerPath: "catsApi",
  baseQuery: (args, api, extraOptions) => baseQueryWithRetry(args, api, extraOptions, 2), // 2 retries max
  endpoints: (builder) => ({
    getCats: builder.query<CatModel[], void>({
      query: () => "breeds",
	  transformResponse: (response: CatModel[]) =>
		response.map((cat) => ({
			...cat,
			avgLifeSpan: getAvgLifeSpan(cat.life_span),
			isLapCat: isLapCat(cat.affection_level, cat.energy_level),
		})),
    }),
    getCatById: builder.query<CatModel, string>({
      query: (id) => `breeds/${id}`,
    }),
  }),
});

export const { useGetCatsQuery, useGetCatByIdQuery } = catsApi;
export default catsApi;
