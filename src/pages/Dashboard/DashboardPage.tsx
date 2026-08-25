// ============================================================
// Dashboard Page
// ============================================================

import React from 'react';
import { Box, Grid, Card, CardContent, Typography, alpha, useTheme } from '@mui/material';
import FlightRoundedIcon from '@mui/icons-material/FlightRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PageHeader from '../../components/common/PageHeader/PageHeader';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, gradient, glowColor }) => {
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px -8px ${alpha(glowColor, 0.3)}`,
          borderColor: alpha(glowColor, 0.3),
          '& .icon-wrapper': {
            transform: 'scale(1.1) rotate(5deg)',
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: gradient,
        },
        // Decorative background mesh
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${alpha(glowColor, 0.15)} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 0.75 }}>
              {changeType === 'up' ? (
                <TrendingUpRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
              ) : (
                <TrendingDownRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
              )}
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: changeType === 'up' ? 'success.main' : 'error.main', fontSize: '0.8rem' }}
              >
                {change}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                vs last month
              </Typography>
            </Box>
          </Box>
          <Box
            className="icon-wrapper"
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: gradient,
              boxShadow: `0 8px 16px -4px ${alpha(glowColor, 0.4)}`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Mock Timeline Component
const TimelineItem: React.FC<{ title: string, time: string, description: string, icon: React.ReactNode, color: string, isLast?: boolean }> = ({ title, time, description, icon, color, isLast }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: isLast ? 0 : 3 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ 
        width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: alpha(color, 0.15), color: color, border: `1px solid ${alpha(color, 0.3)}`
      }}>
        {icon}
      </Box>
      {!isLast && <Box sx={{ flex: 1, width: 2, background: `linear-gradient(to bottom, ${alpha(color, 0.3)}, transparent)`, my: 0.5 }} />}
    </Box>
    <Box sx={{ pt: 1, pb: isLast ? 0 : 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: color, fontWeight: 600, display: 'block', mb: 0.5 }}>{time}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Box>
  </Box>
);

const DashboardPage: React.FC = () => {
  const theme = useTheme();

  const stats: StatCardProps[] = [
    {
      title: 'Total Aircraft',
      value: '47',
      change: '+12%',
      changeType: 'up',
      icon: <FlightRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      glowColor: '#6366f1'
    },
    {
      title: 'Active Orders',
      value: '128',
      change: '+8%',
      changeType: 'up',
      icon: <ShoppingCartRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      glowColor: '#0ea5e9'
    },
    {
      title: 'Maintenance Tasks',
      value: '23',
      change: '-5%',
      changeType: 'down',
      icon: <BuildRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      glowColor: '#f59e0b'
    },
    {
      title: 'Active Users',
      value: '342',
      change: '+18%',
      changeType: 'up',
      icon: <PeopleRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glowColor: '#10b981'
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to AeroFleet ERP — your enterprise resource hub."
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                Activity Feed
              </Typography>
              
              <Box>
                <TimelineItem 
                  title="New Aircraft Registered" 
                  time="10 mins ago" 
                  description="Boeing 737-800 (Tail: N738AA) was added to the main fleet by Admin User."
                  icon={<AddCircleRoundedIcon fontSize="small" />}
                  color={theme.palette.primary.main}
                />
                <TimelineItem 
                  title="Purchase Order Approved" 
                  time="2 hours ago" 
                  description="PO-2026-089 for Engine Parts ($45,200) was approved by Finance Director."
                  icon={<CheckCircleRoundedIcon fontSize="small" />}
                  color={theme.palette.success.main}
                />
                <TimelineItem 
                  title="Maintenance Alert" 
                  time="5 hours ago" 
                  description="Routine A-Check is due for Airbus A320 (Tail: N320BA) within 48 hours."
                  icon={<WarningRoundedIcon fontSize="small" />}
                  color={theme.palette.warning.main}
                  isLast
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Register Aircraft', gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)', border: 'rgba(99, 102, 241, 0.4)' },
                  { label: 'Create Purchase Order', gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)', border: 'rgba(14, 165, 233, 0.4)' },
                  { label: 'Schedule Maintenance', gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)', border: 'rgba(245, 158, 11, 0.4)' },
                  { label: 'Generate Report', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)', border: 'rgba(16, 185, 129, 0.4)' },
                ].map((action) => (
                  <Box
                    key={action.label}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      background: action.gradient,
                      border: `1px solid ${alpha(action.border, 0.2)}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      '&:hover': { 
                        transform: 'scale(1.02) translateX(4px)',
                        border: `1px solid ${action.border}`,
                        boxShadow: `0 4px 12px ${alpha(action.border, 0.15)}`
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {action.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: action.border }}>
                      →
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
