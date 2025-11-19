import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useThemeContext } from "@/contexts/ThemeContext";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const ValueCardComponent = React.forwardRef<HTMLDivElement, ValueCardProps>(({
  icon,
  title,
  description,
  className,
  ...props
}, ref) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Card
      ref={ref}
      sx={{
        textAlign: 'center',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        border: '1px solid',
        borderRadius: 2,
        transition: 'all 0.3s, background-color 0.5s, border-color 0.5s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDark ? '0 10px 30px rgba(229, 9, 20, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.15)',
          borderColor: '#e50914'
        }
      }}
      className={className}
      {...props}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box 
          sx={{ 
            fontSize: '3rem', 
            mb: 1, 
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          {icon}
        </Box>
        <Typography 
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 600,
            mb: 1,
            color: isDark ? '#e50914' : '#b20710',
            transition: 'color 0.5s'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2"
          sx={{
            fontSize: { xs: '0.875rem', sm: '0.875rem' },
            lineHeight: 1.75,
            color: isDark ? '#b3b3b3' : '#616161',
            transition: 'color 0.5s'
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
});

ValueCardComponent.displayName = "ValueCard";

export default React.memo(ValueCardComponent);
