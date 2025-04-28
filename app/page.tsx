'use client';

import { Card, CardContent, Typography, Box, Grid, Drawer, List, ListItem, ListItemText, ListItemButton, Collapse } from "@mui/material";
import dayjs from 'dayjs';
import { useState, useRef } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const cardContents = [
  {
    title: "Week 1 (Jan 6-10)",
    content: "First week of January. Setting goals and planning for the new year.",
    date: "2025-01-06"
  },
  {
    title: "Week 2 (Jan 13-17)",
    content: "Second week of January. Making progress on new year resolutions.",
    date: "2025-01-13"
  },
  {
    title: "Week 3 (Feb 3-7)",
    content: "Third week of the year. Building momentum on key projects.",
    date: "2025-02-03"
  },
  {
    title: "Week 4 (Feb 10-14)",
    content: "Fourth week of the year. Reviewing and adjusting strategies.",
    date: "2025-02-10"
  },
  {
    title: "Week 5 (Mar 3-7)",
    content: "Fifth week of the year. Implementing new processes and systems.",
    date: "2025-03-03"
  },
  {
    title: "Week 6 (Mar 10-14)",
    content: "Sixth week of the year. Evaluating progress and making improvements.",
    date: "2025-03-10"
  },
  {
    title: "Week 7 (Apr 7-11)",
    content: "Seventh week of the year. Finalizing Q1 objectives and planning Q2.",
    date: "2025-04-07"
  },
  {
    title: "Week 8 (Apr 14-18)",
    content: "Eighth week of the year. Setting up for successful Q2 execution.",
    date: "2025-04-14"
  },
  {
    title: "Week 9 (Dec 2-6)",
    content: "Ninth week of the year. Year-end review and planning.",
    date: "2024-12-02"
  },
  {
    title: "Week 10 (Dec 9-13)",
    content: "Tenth week of the year. Holiday preparations and team celebrations.",
    date: "2024-12-09"
  }
];

export default function Home() {
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
    cardRefs.current[index]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const toggleMonth = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  // Group cards by month
  const cardsByMonth = cardContents.reduce((acc, card, index) => {
    const month = dayjs(card.date).format('MMMM YYYY');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push({ ...card, index });
    return acc;
  }, {} as Record<string, Array<typeof cardContents[0] & { index: number }>>);

  // Sort months in reverse chronological order
  const sortedMonths = Object.entries(cardsByMonth).sort((a, b) => {
    return dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf();
  });

  // Group by year and sort by date
  const cardsByYear = sortedMonths.reduce((acc, [month, cards]) => {
    const year = dayjs(month).format('YYYY');
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push([month, cards]);
    return acc;
  }, {} as Record<string, Array<[string, Array<typeof cardContents[0] & { index: number }>]>>);

  // Sort years in reverse order
  const sortedYears = Object.entries(cardsByYear).sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#fafafa'
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              px: 2,
              py: 2,
              color: '#1976d2',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textAlign: 'center',
              borderBottom: '1px solid #e0e0e0',
              mb: 2
            }}
          >
            Henry's Work Diary
          </Typography>
          {sortedYears.map(([year, months]) => (
            <Box key={year}>
              <Typography
                variant="h6"
                sx={{
                  px: 2,
                  py: 1,
                  color: '#666',
                  fontWeight: 'medium',
                  fontSize: '1.2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {year}
              </Typography>
              <List component="nav">
                {months.map(([month, cards]) => (
                  <Box key={month}>
                    <ListItemButton
                      onClick={() => toggleMonth(month)}
                      sx={{
                        py: 0.5,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
                      <ListItemText
                        primary={dayjs(month).format('MMMM')}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          color: '#666'
                        }}
                      />
                      {expandedMonths[month] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={expandedMonths[month]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {cards.map((card) => (
                          <ListItemButton
                            key={card.index}
                            onClick={() => handleCardClick(card.index)}
                            selected={selectedCardIndex === card.index}
                            sx={{
                              pl: 4,
                              py: 0.5,
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                }
                              }
                            }}
                          >
                            <ListItemText
                              primary={card.title}
                              primaryTypographyProps={{
                                fontSize: '0.85rem',
                                color: selectedCardIndex === card.index ? '#1976d2' : '#666'
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-8">
            {sortedYears.map(([year, months]) => (
              <div key={year}>
                <Typography 
                  variant="h5" 
                  component="h1" 
                  sx={{ 
                    mb: 3,
                    color: '#666',
                    fontWeight: 'medium',
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  {year}
                </Typography>
                <div className="flex flex-col gap-6">
                  {months.map(([month, cards]) => (
                    <div key={month}>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        sx={{ 
                          mb: 2,
                          color: '#666',
                          fontWeight: 'medium',
                          borderBottom: '1px solid #e0e0e0',
                          paddingBottom: '4px',
                          fontSize: '1.1rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {dayjs(month).format('MMMM')}
                      </Typography>
                      {cards.map((card) => (
                        <Card 
                          key={card.index}
                          ref={(el: HTMLDivElement | null) => {
                            cardRefs.current[card.index] = el;
                          }}
                          onClick={() => handleCardClick(card.index)}
                          sx={{ 
                            width: '100%',
                            transition: 'all 0.3s ease',
                            transform: card.index === selectedCardIndex ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: card.index === selectedCardIndex 
                              ? '0 4px 20px rgba(0, 0, 0, 0.15)' 
                              : '0 2px 4px rgba(0, 0, 0, 0.1)',
                            border: card.index === selectedCardIndex 
                              ? '2px solid #1976d2' 
                              : '2px solid transparent',
                            cursor: 'pointer',
                            mb: 2,
                            '&:hover': {
                              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                              transform: 'scale(1.01)',
                            }
                          }}
                        >
                          <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                              {card.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {card.content}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
    </div>
      </Box>
    </Box>
  );
}
