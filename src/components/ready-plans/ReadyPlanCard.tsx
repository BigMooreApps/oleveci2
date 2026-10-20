import React from 'react';
import { Calendar, MapPin, Sparkles, Route } from 'lucide-react';
import { SimulatedReadyPlan, resolvePlanPosts } from '../../data/readyPlansData';
import { Post } from '../../types';
import { PlanBackgroundImages } from '../InvitationCardPreview';
import { OleVeciIcon } from '../OleVeciLogo';
import { getAvatarUrl } from '../../utils/imageOptimization';

export interface ReadyPlanCardProps {
  plan: SimulatedReadyPlan;
  posts: Post[];
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export const ReadyPlanCard: React.FC<ReadyPlanCardProps> = ({
  plan,
  posts,
  onClick,
  className = '',
  style,
  priority = false,
}) => {
  const planPosts = resolvePlanPosts(plan, posts);

  return (
    <div
      onClick={onClick}
      style={style}
      className={`group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer select-none ${className}`}
      title={`Toca para ver el plan: ${plan.planTitle}`}
    >
      {/* 1. Header Oficial OleVeci (Logo limpio sin recuadro y sin Cajicá junto al logo) */}
      <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-gradient-to-r from-[#003B99] via-[#0056D6] to-[#007AF7] border-b border-blue-400/20 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <OleVeciIcon size={20} className="shrink-0 drop-shadow-sm" />
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-white uppercase block leading-none truncate">
              OLEVECI RUTA
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] text-blue-100 font-medium block mt-0.5 truncate">
              Plan Vecinal Oficial
            </span>
          </div>
        </div>
        <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-white/95 bg-white/15 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20 shadow-xs flex items-center gap-1 shrink-0">
          <Route className="w-2.5 h-2.5 text-cyan-200" strokeWidth={2.4} />
          <span>{planPosts.length} {planPosts.length === 1 ? 'parada' : 'paradas'}</span>
        </span>
      </div>

      {/* 2. Foto en Corte Vertical (Aspect 4/5) */}
      <div className="relative w-full aspect-[4/5] bg-slate-950 overflow-hidden shrink-0 select-none">
        <PlanBackgroundImages
          posts={planPosts}
          bgLayout={plan.bgLayout || 'vertical'}
          theme={plan.theme}
          priority={priority}
          targetWidth={380}
          imageClassName="group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Día y Hora sobre la foto */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold border border-white/20 shadow-md">
            <Calendar className="w-3 h-3 text-cyan-200 shrink-0" />
            <span className="truncate">{plan.scheduledTime}</span>
          </div>
        </div>
      </div>

      {/* 3. Contenido en Fondo Blanco con Identidad OleVeci */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 bg-white text-slate-800">
        <div>
          <h3 className="text-xs sm:text-base font-black text-[#031c54] group-hover:text-[#0056d6] transition-colors leading-tight line-clamp-2">
            {plan.planTitle}
          </h3>

          {/* Stops avatar preview */}
          <div className="mt-2 flex items-center gap-1.5 overflow-hidden">
            <div className="flex -space-x-1.5 shrink-0">
              {planPosts.slice(0, 3).map((post, stopIdx) => (
                <img
                  key={post.id || stopIdx}
                  src={getAvatarUrl(post.imageUrl)}
                  alt=""
                  className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full object-cover border border-white shadow-2xs"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              {planPosts.map((p) => p.businessName).slice(0, 2).join(', ')}
            </span>
          </div>
        </div>

        {/* Footer: Municipio y Presupuesto */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium truncate max-w-[90px] sm:max-w-none">
            <MapPin className="w-3 h-3 text-[#0056d6] shrink-0" />
            <span className="truncate">{plan.municipality || 'Cajicá'}</span>
          </span>
          <span className="font-extrabold text-[#031c54] shrink-0">
            ${plan.estimatedBudget > 0 ? (plan.estimatedBudget >= 1000000 ? `${(plan.estimatedBudget / 1000000).toFixed(1)}M` : `${Math.round(plan.estimatedBudget / 1000)}k`) : '0'}
          </span>
        </div>
      </div>
    </div>
  );
};
