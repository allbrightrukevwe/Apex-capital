'use client';

const StatusIndicator = () => {
  return (
    <div className="py-2 mt-4 mx-auto lg:mx-0 lg:px-12 w-fit animate-heartbeat">
      <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">
        <span className="text-teal-500">•</span>
        AI TRADING 
        <span className="text-teal-500">•</span>
        LIVE 24/7
      </span>
    </div>
  );
};

export default StatusIndicator;