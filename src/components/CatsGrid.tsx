import { FC, useCallback, useState } from "react";
import clsx from "clsx";
import { CatModel } from "../types/cats";
import { useAppSelector } from "../store/store";

const SORT_OPTIONS = {
    adaptability: "Adaptability",
    affection_level: "Affection level",
    avgLifeSpan: "Avarage Life Span",
}

interface CatsGridProps {
    cats: CatModel[]
}

const CatsGrid: FC<CatsGridProps> = ({cats: allCats}) => {
    const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);
    const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [isDescend, setIsDescend] = useState(false);

    const uniqueCountries = allCats
    .map((cat) => ({
      origin: cat.origin,
      country_code: cat.country_code,
    }))
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.origin === value.origin && t.country_code === value.country_code
        )
    );

    const filterCats = useCallback((cats: CatModel[]) => {
        if (!selectedCountryCode || selectedCountryCode === "0") return cats;
        
        return cats.filter((cat) => cat.country_code === selectedCountryCode);
    }, [selectedCountryCode]);
    
    const sortCats = useCallback((cats: CatModel[]) => {
        if (!selectedSort || selectedSort === "0") return cats;
    
        const isValidSortKey = (key: string) => key in cats[0];
    
        if (!isValidSortKey(selectedSort)) return cats;

        const catsCopy = [...cats];

        return catsCopy.sort((catA, catB) => {
            const valueA = catA[selectedSort as keyof CatModel];
            const valueB = catB[selectedSort as keyof CatModel];
    
            if (valueA === undefined) return 1;
            if (valueB === undefined) return -1;
    
            if (typeof valueA === "string" && typeof valueB === "string") {
                return isDescend ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
            }
    
            if (typeof valueA === "number" && typeof valueB === "number") {
                return isDescend ? valueB - valueA : valueA - valueB;
            }
    
            return 0;
        });
    }, [selectedSort, isDescend]);
    
    const filteredCats = filterCats(allCats);
    const sortedCats = sortCats(filteredCats);

    return (
        <div>
    <div className="my-4 space-y-4">
      <div>
        <select
          defaultValue={"0"}
          className={clsx(
            "py-3 px-4 pe-9 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
            isDarkMode ? "bg-neutral-900 text-white border-neutral-700 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-200 placeholder-gray-400"
          )}
          onChange={(e) => setSelectedCountryCode(e.target.value)}
        >
          <option value={"0"}>Filter by country</option>
          {uniqueCountries.map((country) => (
            <option key={country.country_code} value={country.country_code}>
              {country.origin}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <select
          defaultValue={"0"}
          className={clsx(
            "py-3 px-4 pe-9 w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
            isDarkMode ? "bg-neutral-900 text-white border-neutral-700 placeholder-neutral-500" : "bg-white text-gray-900 border-gray-200 placeholder-gray-400"
          )}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value={"0"}>Sort by...</option>
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="desc"
            checked={isDescend}
            className={clsx(
              "h-5 w-5 rounded text-blue-600 focus:ring-blue-500",
              isDarkMode ? "bg-neutral-800 border-neutral-700 checked:bg-blue-500 checked:border-blue-500 focus:ring-offset-gray-800" : "bg-white border-gray-300"
            )}
            onChange={(e) => setIsDescend(e.target.checked)}
          />
          <label htmlFor="desc" className={clsx("text-sm", isDarkMode ? "text-neutral-400" : "text-gray-700")}>
            Descend
          </label>
        </div>
      </div>
    </div>

    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedCats &&
        sortedCats.map((cat: any) => (
          <div
            key={Math.random()}
            className={clsx(
              "group flex flex-col h-full rounded-xl shadow-sm",
              isDarkMode ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-200"
            )}
          >
            <div className="p-4 md:p-6">
              <h3 className={clsx("text-xl font-semibold mb-2", isDarkMode ? "text-white" : "text-gray-800")}>
                {cat.name}
              </h3>
              <span className="block mb-1 text-xs font-semibold uppercase text-blue-600">
                Origin: {cat.origin || "Unknown"}
              </span>
              <p className={clsx("mt-3 line-clamp-3", isDarkMode ? "text-neutral-400" : "text-gray-500")}>
                {cat.description || "No description available"}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Adaptability:</span>
                  <span>{cat.adaptability}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Affection Level:</span>
                  <span>{cat.affection_level}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Life Span:</span>
                  <span>{cat.avgLifeSpan} years</span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>);
}

export default CatsGrid;