import React from 'react';
import { 
  Shirt, Tv, Trophy, Watch, Footprints, Home, Compass, Sparkles, 
  Briefcase, Printer, Baby, HeartHandshake, Activity, Gift, Dog, 
  BookOpen, Cog, Store, HardHat, Building, Armchair, Lightbulb, 
  Microwave, Car, Wrench, Hammer, Sun, Zap, ShieldAlert, 
  Forklift, Gauge, Cpu, CircuitBoard, Truck, Wheat, Layers, 
  Factory, BriefcaseBusiness
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

const ICON_MAP = {
  Shirt, Tv, Trophy, Watch, Footprints, Home, Compass, Sparkles, 
  Briefcase, Printer, Baby, HeartHandshake, Activity, Gift, Dog, 
  BookOpen, Cog, Store, HardHat, Building, Armchair, Lightbulb, 
  Microwave, Car, Wrench, Hammer, Sun, Zap, ShieldAlert, 
  Forklift, Gauge, Cpu, CircuitBoard, Truck, Wheat, Layers, 
  Factory, BriefcaseBusiness
};

export const CategoryBubbles = ({ onSelectCategory, selectedCategoryId }) => {
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>Categories & Sourcing Hubs</span>
          <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-2 py-0.5 rounded-full">
            38 Official Sectors
          </span>
        </h3>
        <span className="text-xs text-orange-600 font-semibold cursor-pointer hover:underline">
          Scroll for All 38 Sectors →
        </span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {/* All Categories Bubble */}
        <button
          onClick={() => onSelectCategory('all')}
          className="flex flex-col items-center gap-2 flex-shrink-0 group focus:outline-none"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
            selectedCategoryId === 'all'
              ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white ring-4 ring-orange-500/20 scale-105'
              : 'bg-white border border-slate-200 text-slate-700 group-hover:border-orange-400 group-hover:bg-orange-50/50'
          }`}>
            <Layers className="w-7 h-7" />
          </div>
          <span className={`text-[11px] font-bold text-center w-20 line-clamp-1 ${
            selectedCategoryId === 'all' ? 'text-orange-600' : 'text-slate-700'
          }`}>
            All 38 Sectors
          </span>
        </button>

        {/* 38 Category Circular Cards */}
        {CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Layers;
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group focus:outline-none"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white ring-4 ring-orange-500/20 scale-105'
                  : 'bg-white border border-slate-200 text-slate-700 group-hover:border-orange-400 group-hover:bg-orange-50/50 group-hover:scale-105'
              }`}>
                <IconComp className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-slate-700 group-hover:text-orange-500'}`} />
              </div>
              <span className={`text-[11px] font-medium text-center w-20 line-clamp-1 leading-tight ${
                isSelected ? 'font-bold text-orange-600' : 'text-slate-700 group-hover:text-orange-600'
              }`} title={cat.name}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
