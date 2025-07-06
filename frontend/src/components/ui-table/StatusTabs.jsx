import { Tabs, Tab } from '@mui/material';
import StatusBadge from './StatusBadge';

function StatusTabs({ tabIndex, handleTabChange, data, statuses }) {
  return (
    <Tabs
      value={tabIndex}
      onChange={handleTabChange}
      aria-label="status tabs" 
      sx={{
        'boxShadow': 'inset 0 -2px 0 0 rgba(145 158 171 / 0.08)',
        '& .MuiTabs-indicator': {
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
          width: '100%',
          backgroundColor: '#1C252E',
        },
      }}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    >
      <Tab
        sx={{ 
          textTransform: 'none',
          '&.Mui-selected': {
            color: '#1C252E',
            fontWeight: 'bold',
          },
        }}  
        label={<StatusBadge status="All" count={data.length} badgeClass="bg-dark" />}
      />
      {Object.keys(statuses).map((status, index) => {
        const count = data.filter(item => item.status === status).length;

        let badgeClass = '';
        const colorClass = statuses[status].color === 'warning' ? 'text-dark' : '';

        if (tabIndex === index + 1) {
          badgeClass = `bg-${statuses[status].color} ${colorClass}`;
        } else {
          badgeClass = `bg-label-${statuses[status].color} ${colorClass}`;
        }

        return (
          <Tab
            sx={{ 
              textTransform: 'none',
              '&.Mui-selected': {
                color: '#1C252E',
                fontWeight: 'bold',
              },
            }}    
            key={status}
            label={<StatusBadge status={statuses[status].label} count={count} badgeClass={badgeClass} />}
          />
        );
      })}
    </Tabs>
  );
}

export default StatusTabs;