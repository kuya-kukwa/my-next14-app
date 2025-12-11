import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { PasswordStrength } from '@/lib/validation/profileSchemas';

interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  strength,
}) => {
  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return '#ef4444'; // red
      case 1:
        return '#f97316'; // orange
      case 2:
        return '#f59e0b'; // yellow
      case 3:
        return '#10b981'; // green
      case 4:
        return '#059669'; // dark green
      default:
        return '#6b7280'; // gray
    }
  };

  const color = getStrengthColor(strength.score);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Strength Bar */}
      <Box sx={{ mb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 1,
          }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor:
                  index <= strength.score ? color : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: color,
          }}
        >
          {strength.label}
        </Typography>
      </Box>

      {/* Requirements Checklist */}
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            mb: 1,
            color: '#e5e5e5',
          }}
        >
          Password Requirements:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {[
            {
              met: strength.requirements.minLength,
              label: 'At least 8 characters',
            },
            {
              met: strength.requirements.hasUppercase,
              label: 'One uppercase letter',
            },
            {
              met: strength.requirements.hasLowercase,
              label: 'One lowercase letter',
            },
            { met: strength.requirements.hasNumber, label: 'One number' },
            {
              met: strength.requirements.hasSpecialChar,
              label: 'One special character',
            },
          ].map((requirement, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {requirement.met ? (
                <CheckCircleIcon
                  sx={{
                    fontSize: '1rem',
                    color: '#10b981',
                  }}
                />
              ) : (
                <RadioButtonUncheckedIcon
                  sx={{
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                />
              )}
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: requirement.met ? '#e5e5e5' : 'rgba(255,255,255,0.5)',
                }}
              >
                {requirement.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PasswordStrengthMeter;
