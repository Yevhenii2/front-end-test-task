import { FC, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
} from "recharts";
import CatsGrid from "../components/CatsGrid";
import { useAppSelector } from "../store/store";
import { useGetCatsQuery } from "../services/catsService";
import { COLORS } from "../tools/consts";
import { CatData, CatModel, LifeSpanCatData } from "../types/cats";


const HomePage: FC = () => {
	const navigate: NavigateFunction = useNavigate();
	const isAuthenticated: boolean = useAppSelector(
		(state: {auth: {isAuthenticated: boolean}}) => state.auth.isAuthenticated,
	);
	const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);

	const { data: cats, error, isLoading } = useGetCatsQuery();

	useEffect(() => {
		console.log(cats);
	}, [cats])

	const [adaptabilityData, setAdaptabilityData] = useState<CatData[]>([]);
	const [affectionData, setAffectionData] = useState<CatData[]>([]);
	const [originData, setOriginData] = useState<CatData[]>([]);
	const [indoorData, setIndoorData] = useState<CatData[]>([]);
	const [lapData, setLapData] = useState<CatData[]>([]);
	const [lifeSpanData, setLifeSpanData] = useState<LifeSpanCatData[]>([]);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/sign-in");
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		if ( !cats || !cats.length) return;

		setAdaptabilityData(
			cats.map((cat: CatModel) => ({
				name: cat.name,
				value: cat.adaptability,
			})),
		);

		setAffectionData(
			cats.map((cat: CatModel) => ({
				name: cat.name,
				value: cat.affection_level,
			})),
		);

		const originCount = cats.reduce((acc: { [key: string]: number }, cat: CatModel) => {
			const origin = cat.origin || "Unknown";
			acc[origin] = (acc[origin] || 0) + 1;
			return acc;
		}, {});

		setOriginData(
			Object.entries(originCount).map(([origin, count]) => ({
				name: origin,
				value: count,
			})),
		);

		const indoorCount = cats.reduce((acc: { [key: string]: number }, cat: CatModel) => {
			if (cat.indoor === 1) {
				acc.indoor = (acc.indoor || 0) + 1;
			} else {
				acc.outdoor = (acc.outdoor || 0) + 1;
			}
			return acc;
		}, {indoor: 0, outdor: 0});

		const lapCatCount = cats.reduce(
			(acc: { lapCat: number; notLapCat: number }, cat: CatModel) => {
			  if (cat.isLapCat) {
				acc.lapCat = (acc.lapCat || 0) + 1;
			  } else {
				acc.notLapCat = (acc.notLapCat || 0) + 1;
			  }
		  
			  return acc;
			},
			{ lapCat: 0, notLapCat: 0 }
		  );

		setIndoorData([
			{ name: "Indoor", value: indoorCount.indoor || 0 },
			{ name: "Outdoor", value: indoorCount.outdoor || 0 },
		]);

		setLapData([
			{ name: "Lap Cat", value: lapCatCount.lapCat },
			{ name: "Not Lap Cat", value: lapCatCount.notLapCat },
		]);

		setLifeSpanData(
			cats.map((cat: CatModel) => ({
				name: cat.name,
				years: cat.avgLifeSpan,
			})),
		);
	}, [cats]);

	if (isLoading || error) {
		return (
			<div className="flex items-center justify-center h-screen">
				{isLoading ? (
					<div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
				) : (
					<div className="text-red-500">Error loading cats data</div>
				)}
			</div>
		);
	}
	const bgColor = isDarkMode ? "bg-neutral-900 text-white" : "bg-white text-gray-900";
	const chartGridColor = isDarkMode ? "#444" : "#ccc";
	const strokeColor = isDarkMode ? "#ddd" : "#000";
	const tooltipBg = isDarkMode ? "#333" : "#fff";
	const tooltipText = isDarkMode ? "#fff" : "#000";
	
	return (
		<div className="container mx-auto px-4 py-8">
		<h1 className="text-4xl font-bold mb-8">Cat Breeds Statistics</h1>
  
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
		  {/* Adaptability Chart */}
		  <div className={`p-4 rounded-xl shadow-sm ${bgColor}`}>
			<h2 className="text-xl font-semibold mb-4">Adaptability Distribution</h2>
			<div className="h-[300px]">
			  <ResponsiveContainer>
				<BarChart data={adaptabilityData}>
				  <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
				  <XAxis dataKey="name" hide />
				  <YAxis stroke={strokeColor} />
				  <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: tooltipText }} />
				  <Bar dataKey="value" name="Adaptability" fill="#0088FE" />
				</BarChart>
			  </ResponsiveContainer>
			</div>
		  </div>
  
		  {/* Affection Levels */}
		  <div className={`p-4 rounded-xl shadow-sm ${bgColor}`}>
			<h2 className="text-xl font-semibold mb-4">Affection Levels</h2>
			<div className="h-[300px]">
			  <ResponsiveContainer>
				<BarChart data={affectionData}>
				  <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
				  <XAxis dataKey="name" hide />
				  <YAxis stroke={strokeColor} />
				  <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: tooltipText }} />
				  <Bar dataKey="value" name="Affection" fill="#00C49F" />
				</BarChart>
			  </ResponsiveContainer>
			</div>
		  </div>
  
		  {/* Top Origins */}
		  <div className={`p-4 rounded-xl shadow-sm ${bgColor}`}>
			<h2 className="text-xl font-semibold mb-4">Top Origins</h2>
			<div className="h-[300px]">
			  <ResponsiveContainer>
				<BarChart data={originData}>
				  <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
				  <XAxis dataKey="name" hide />
				  <YAxis stroke={strokeColor} />
				  <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: tooltipText }} />
				  <Bar dataKey="value" name="Breeds" fill="#0088FE" />
				</BarChart>
			  </ResponsiveContainer>
			</div>
		  </div>
  
		  {/* Indoor vs Outdoor Chart */}
		  <div className={`p-4 rounded-xl shadow-sm ${bgColor}`}>
			<h2 className="text-xl font-semibold mb-4">Indoor vs Outdoor Preference</h2>
			<div className="h-[300px]">
			  <ResponsiveContainer>
				<PieChart>
				  <Pie data={indoorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
					{indoorData.map((_, index) => (
					  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				  </Pie>
				  <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: tooltipText }} />
				  <Legend />
				</PieChart>
			  </ResponsiveContainer>
			</div>
		  </div>
  
		  {/* Lap Cat Distribution */}
		  <div className={`p-4 rounded-xl shadow-sm ${bgColor}`}>
			<h2 className="text-xl font-semibold mb-4">Lap Cat Distribution</h2>
			<div className="h-[300px]">
			  <ResponsiveContainer>
				<PieChart>
				  <Pie data={lapData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
					{lapData.map((_, index) => (
					  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				  </Pie>
				  <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: tooltipText }} />
				  <Legend />
				</PieChart>
			  </ResponsiveContainer>
			</div>
		  </div>
  
		  {/* Life Span Distribution */}
		  <div className={`p-4 rounded-xl shadow-sm ${bgColor}`}>
			<h2 className="text-xl font-semibold mb-4">Life Span Distribution</h2>
			<div className="h-[300px]">
			  <ResponsiveContainer>
				<LineChart data={lifeSpanData}>
				  <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
				  <XAxis dataKey="name" hide />
				  <YAxis stroke={strokeColor} />
				  <Tooltip contentStyle={{ backgroundColor: tooltipBg, color: tooltipText }} />
				  <Line type="monotone" dataKey="years" stroke={strokeColor} />
				</LineChart>
			  </ResponsiveContainer>
			</div>
		  </div>
		</div>
  
		{/* Cats Grid */}
		{cats && <CatsGrid cats={cats} />}
	  </div>
	);
};

export default HomePage;
