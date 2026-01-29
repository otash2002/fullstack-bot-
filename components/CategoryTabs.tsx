import React from 'react';
import { Category } from '../types';
import PizzaIcon from './icons/PizzaIcon';
import HotDogIcon from './icons/HotDogIcon';
import SandwichIcon from './icons/SandwichIcon';
import LavashIcon from './icons/LavashIcon';
import BurgerIcon from './icons/BurgerIcon';
import DrinkIcon from './icons/DrinkIcon';

interface CategoryTabsProps {
    categories: Category[];
    activeCategory: Category;
    onSelectCategory: (category: Category) => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
    'Barchasi': null,
    'Pizza': <PizzaIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />,
    'Hot-Dog': <HotDogIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />,
    'Sandwich': <SandwichIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />,
    'Lavash': <LavashIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />,
    'Doner': <BurgerIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />,
    'Burger': <BurgerIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />,
    'Ichimliklar': <DrinkIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />,
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onSelectCategory }) => {
    return (
        <div className="sticky top-0 bg-slate-900 z-20 py-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
            <div className="container mx-auto px-4">
                <div className="flex justify-center space-x-2 md:space-x-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`flex items-center justify-center flex-shrink-0 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 border ${
                                activeCategory === category 
                                    ? 'bg-yellow-400 text-slate-900 border-yellow-500 shadow-lg' 
                                    : 'bg-slate-800 text-gray-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                            }`}
                        >
                            {categoryIcons[category]}
                            {category.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryTabs;