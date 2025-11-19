"use client";

import React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Twitter, LinkedIn, GitHub, Facebook } from "@mui/icons-material";
import { teamMembers } from "@/data/teams";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function TeamSection() {
  const [failedMap, setFailedMap] = React.useState<Record<number, boolean>>({});
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Box 
      component="section"
      id="team"
      sx={{
        py: { xs: 4, sm: 6, md: 8, lg: 10 },
        backgroundColor: isDark ? 'transparent' : '#f8f9fa',
        transition: 'background-color 0.5s'
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', mb: { xs: 3, sm: 4, md: 6 } }}>
          <Typography 
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3.5rem' },
              fontWeight: 800,
              mb: { xs: 2, sm: 2.5 },
              color: isDark ? '#ffffff' : '#1a1a1a',
              transition: 'color 0.5s',
              letterSpacing: '-0.02em'
            }}
          >
            Meet Our Team
          </Typography>
          <Typography 
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              maxWidth: '48rem',
              mx: 'auto',
              color: isDark ? '#b3b3b3' : '#495057',
              transition: 'color 0.5s',
              lineHeight: 1.6
            }}
          >
            Meet the passionate team behind NextFlix's innovative streaming experience
          </Typography>
        </Box>

        {/* Team Grid */}
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {teamMembers.map((member) => (
              <Grid size={{ xs: 4, sm: 4, md: 4 }} key={member.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e9ecef',
                    border: '1px solid',
                    borderRadius: 3,
                    boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s, background-color 0.5s, border-color 0.5s',
                    '&:hover': {
                      borderColor: 'rgba(229, 9, 20, 0.5)',
                      boxShadow: '0 12px 24px rgba(229, 9, 20, 0.15)',
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.25, sm: 2, md: 2.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Avatar */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '3.25rem', sm: '4rem', md: '5rem' },
                          height: { xs: '3.25rem', sm: '4rem', md: '5rem' },
                          mx: 'auto',
                          border: '2px solid',
                          borderColor: isDark ? 'rgba(128, 128, 128, 0.4)' : 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '50%',
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: 'rgba(229, 9, 20, 0.5)'
                          }
                        }}
                      >
                        <Box 
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom right, #e50914, #b20710)',
                            borderRadius: '50%',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            opacity: 0.4,
                            transition: 'opacity 0.3s',
                            zIndex: 0,
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                        />
                        <Box 
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.85rem', sm: '1rem', md: '1.25rem' },
                            color: isDark ? '#ffffff' : '#212121'
                          }}
                        >
                          {member.avatar && !failedMap[member.id] ? (
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              width={200}
                              height={200}
                              style={{
                                objectFit: "cover",
                                objectPosition: member.objectPosition || "center",
                                width: "100%",
                                height: "100%",
                              }}
                              onError={() =>
                                setFailedMap((p) => ({ ...p, [member.id]: true }))
                              }
                            />
                          ) : (
                            member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Info */}
                    <Box sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.25rem' },
                          mb: 0.5,
                          px: 1,
                          py: 0.5,
                          borderRadius: 2,
                          transition: 'all 0.3s',
                          color: isDark ? '#ffffff' : '#212121',
                          cursor: 'default',
                          '&:hover': {
                            color: '#e50914 !important',
                            backgroundColor: 'rgba(229, 9, 20, 0.1)'
                          }
                        }}
                      >
                        {member.name}
                      </Typography>

                      <Typography 
                        sx={{
                          color: isDark ? '#ffffff' : '#212121',
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                          mb: 1.5
                        }}
                      >
                        {member.role}
                      </Typography>

                      {member.bio && (
                        <Typography 
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.72rem', sm: '0.8rem', md: '0.9rem' },
                            lineHeight: 1.6,
                            flexGrow: 1,
                            color: isDark ? '#b3b3b3' : '#616161',
                            transition: 'color 0.5s',
                            mb: 2
                          }}
                        >
                          {member.bio}
                        </Typography>
                      )}

                      {/* Social Icons */}
                      {member.social && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 'auto' }}>
                          {member.social.twitter && (
                            <IconButton
                              component="a"
                              href={member.social.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                color: isDark ? '#b3b3b3' : '#616161',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  color: '#1DA1F2',
                                  transform: 'translateY(-2px)',
                                  backgroundColor: 'rgba(29, 161, 242, 0.1)'
                                }
                              }}
                            >
                              <Twitter fontSize="small" />
                            </IconButton>
                          )}
                          {member.social.linkedin && (
                            <IconButton
                              component="a"
                              href={member.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                color: isDark ? '#b3b3b3' : '#616161',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  color: '#0A66C2',
                                  transform: 'translateY(-2px)',
                                  backgroundColor: 'rgba(10, 102, 194, 0.1)'
                                }
                              }}
                            >
                              <LinkedIn fontSize="small" />
                            </IconButton>
                          )}
                          {member.social.github && (
                            <IconButton
                              component="a"
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                color: isDark ? '#b3b3b3' : '#616161',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  color: isDark ? '#ffffff' : '#181717',
                                  transform: 'translateY(-2px)',
                                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(24, 23, 23, 0.1)'
                                }
                              }}
                            >
                              <GitHub fontSize="small" />
                            </IconButton>
                          )}
                          {member.social.facebook && (
                            <IconButton
                              component="a"
                              href={member.social.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                color: isDark ? '#b3b3b3' : '#616161',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  color: '#1877F2',
                                  transform: 'translateY(-2px)',
                                  backgroundColor: 'rgba(24, 119, 242, 0.1)'
                                }
                              }}
                            >
                              <Facebook fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      )}
                    </Box>

                    {/* Hover Gradient */}
                    <Box 
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom right, rgba(229, 9, 20, 0.05), transparent)',
                        borderRadius: 3,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        pointerEvents: 'none',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
