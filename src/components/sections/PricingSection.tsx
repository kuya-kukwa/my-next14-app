import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/Check";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: "$9.99",
    period: "/month",
    description: "Perfect for casual viewers",
    features: [
      "HD streaming quality",
      "Watch on 1 device",
      "Unlimited movies & shows",
      "Cancel anytime",
      "Ad-free experience",
    ],
  },
  {
    name: "Standard",
    price: "$14.99",
    period: "/month",
    description: "Great for sharing",
    features: [
      "Full HD streaming quality",
      "Watch on 2 devices simultaneously",
      "Unlimited movies & shows",
      "Cancel anytime",
      "Ad-free experience",
      "Download on 2 devices",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "/month",
    description: "The ultimate experience",
    features: [
      "4K + HDR streaming quality",
      "Watch on 4 devices simultaneously",
      "Unlimited movies & shows",
      "Cancel anytime",
      "Ad-free experience",
      "Download on 4 devices",
      "Dolby Atmos sound",
    ],
  },
];

export default function PricingSection() {
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
        <Typography 
          variant="h2"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.25rem', lg: '3rem' },
            fontWeight: 'bold',
            mb: { xs: 1.5, sm: 2 },
            background: 'linear-gradient(to right, #e50914, #b20710)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Choose Your Plan
        </Typography>
        <Typography 
          sx={{
            color: 'text.secondary',
            maxWidth: { xs: '20rem', sm: '42rem' },
            mx: 'auto',
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
            px: 2
          }}
        >
          Stream unlimited movies and shows. Cancel anytime. No hidden fees.
        </Typography>
      </Box>

      {/* Pricing Cards */}
      <Grid container spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {pricingTiers.map((tier) => (
          <Grid size={{ xs: 12, md: 4 }} key={tier.name}>
            <Card
              sx={{
                position: 'relative',
                borderRadius: 4,
                p: { xs: 3, sm: 4 },
                height: '100%',
                transition: 'all 0.3s',
                background: tier.highlighted
                  ? 'linear-gradient(135deg, rgba(229, 9, 20, 0.2) 0%, rgba(229, 9, 20, 0.1) 50%, transparent 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: tier.highlighted ? '2px solid #e50914' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: tier.highlighted ? '0 20px 40px rgba(229, 9, 20, 0.2)' : 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: tier.highlighted ? '#e50914' : 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <Box sx={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)' }}>
                  <Chip 
                    label={tier.badge}
                    sx={{
                      bgcolor: '#e50914',
                      color: '#ffffff',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontWeight: 'bold',
                      px: 2,
                      py: 0.75,
                      boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)'
                    }}
                  />
                </Box>
              )}

              <CardContent sx={{ p: 0 }}>
                {/* Plan Name */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography 
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      fontWeight: 'bold',
                      color: '#ffffff',
                      mb: 1
                    }}
                  >
                    {tier.name}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {tier.description}
                  </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                    <Typography 
                      sx={{
                        fontSize: { xs: '2.5rem', sm: '3rem' },
                        fontWeight: 'bold',
                        color: '#ffffff'
                      }}
                    >
                      {tier.price}
                    </Typography>
                    <Typography 
                      sx={{
                        color: 'text.secondary',
                        ml: 1,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {tier.period}
                    </Typography>
                  </Box>
                </Box>

                {/* Features */}
                <List sx={{ mb: { xs: 3, sm: 4 } }}>
                  {tier.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0, py: { xs: 0.75, sm: 1 } }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon sx={{ color: '#e50914', width: 20, height: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{
                          sx: {
                            color: '#d1d5db',
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* CTA Button */}
                <Button
                  variant={tier.highlighted ? "contained" : "outlined"}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    ...(tier.highlighted ? {
                      bgcolor: '#e50914',
                      color: '#ffffff',
                      '&:hover': {
                        bgcolor: '#b2070f'
                      }
                    } : {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: '#ffffff',
                      '&:hover': {
                        borderColor: '#e50914',
                        bgcolor: 'rgba(229, 9, 20, 0.1)'
                      }
                    })
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer Note */}
      <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          All plans include a 30-day free trial. No credit card required.
        </Typography>
      </Box>
    </Container>
  );
}
