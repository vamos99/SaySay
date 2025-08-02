"use client";
import React, { useState, useEffect, Fragment, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { PortalLayout } from "@/components/layout/PortalLayout";
import { supabase } from "../../utils/supabaseClient";
import dynamic from 'next/dynamic';

// Chart.js bileşenlerini dynamic import ile yükle
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });
const Doughnut = dynamic(() => import('react-chartjs-2').then(mod => mod.Doughnut), { ssr: false });


const RaporlarPage = () => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'ebeveyn' | 'psikolog'>('ebeveyn');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [chartReady, setChartReady] = useState(false);

  // Chart.js'i client-side'da register et
  useEffect(() => {
    let mounted = true;
    const registerCharts = async () => {
      try {
        const { Chart: ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } = await import('chart.js');
        ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);
        if (mounted) {
          setChartReady(true);
        }
      } catch (error) {
        console.error('Chart.js yükleme hatası:', error);
      }
    };
    registerCharts();
    
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadReports();
    }
  }, [selectedChild, dateRange]);

  const loadChildren = async () => {
    try {
    setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: childrenData, error } = await supabase
        .from('children')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Children fetch error:', error);
        return;
      }

      setChildren(childrenData || []);
      if (childrenData && childrenData.length > 0) {
        setSelectedChild(childrenData[0].id);
      }
    } catch (error) {
      console.error('Load children error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    if (!selectedChild) return;

    try {
      const startDate = new Date();
      switch (dateRange) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }

      const { data: reportsData, error } = await supabase
        .from('interaction_logs')
        .select('*')
        .eq('child_id', selectedChild)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Reports fetch error:', error);
        return;
      }

      setReports(reportsData || []);
    } catch (error) {
      console.error('Load reports error:', error);
    }
  };

  // Grafik verilerini memoize et
  const chartData = useMemo(() => {
    if (!reports.length) return [];

    return reports
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .slice(-7)
      .map(report => ({
        date: new Date(report.created_at).toLocaleDateString('tr-TR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        doğru: report.correct_count || 0,
        yanlış: report.wrong_count || 0,
        süre: Math.round((report.avg_response_time_ms || 0) / 1000)
      }));
  }, [reports]);

  const conceptData = useMemo(() => {
    if (!reports.length) return [];

    const conceptStats = reports.reduce((acc: any, report) => {
      const concept = report.concept || 'Bilinmeyen';
      if (!acc[concept]) {
        acc[concept] = { doğru: 0, yanlış: 0, toplam: 0 };
      }
      acc[concept].doğru += report.correct_count || 0;
      acc[concept].yanlış += report.wrong_count || 0;
      acc[concept].toplam += (report.correct_count || 0) + (report.wrong_count || 0);
      return acc;
    }, {});

    return Object.entries(conceptStats).map(([concept, stats]: [string, any]) => ({
      konu: concept,
      doğru: stats.doğru,
      yanlış: stats.yanlış,
      başarı: stats.toplam > 0 ? Math.round((stats.doğru / stats.toplam) * 100) : 0
    }));
  }, [reports]);

  const performanceData = useMemo(() => {
    if (!reports.length) return [];

    const totalCorrect = reports.reduce((sum, report) => sum + (report.correct_count || 0), 0);
    const totalWrong = reports.reduce((sum, report) => sum + (report.wrong_count || 0), 0);

    return [
      { name: 'Doğru', value: totalCorrect, color: '#10b981' },
      { name: 'Yanlış', value: totalWrong, color: '#ef4444' }
    ];
  }, [reports]);

  const router = useRouter();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid rgba(59, 130, 246, 0.3)',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>Raporlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Raporlar
            </h1>
            <p style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}>
              Çocuğunuzun gelişimini detaylı olarak takip edin
            </p>
          </div>

          {/* Çocuk ve Tarih Seçici */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'start'
            }}>
              {/* Çocuk Seçici */}
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>Çocuk Seçin</h3>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  {children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: selectedChild === child.id ? '2px solid #3b82f6' : '1px solid rgba(59, 130, 246, 0.2)',
                        background: selectedChild === child.id ? 'linear-gradient(to right, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.8)',
                        color: selectedChild === child.id ? 'white' : '#1f2937',
                        fontWeight: selectedChild === child.id ? '600' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '0.8rem'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChild !== child.id) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedChild !== child.id) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarih Aralığı Seçici */}
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>Tarih Aralığı</h3>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  {[
                    { value: 'week', label: 'Son 1 Hafta' },
                    { value: 'month', label: 'Son 1 Ay' },
                    { value: 'year', label: 'Son 1 Yıl' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setDateRange(option.value as any)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: dateRange === option.value ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.2)',
                        background: dateRange === option.value ? 'linear-gradient(to right, #10b981, #059669)' : 'rgba(255, 255, 255, 0.8)',
                        color: dateRange === option.value ? 'white' : '#1f2937',
                        fontWeight: dateRange === option.value ? '600' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '0.8rem'
                      }}
                      onMouseEnter={(e) => {
                        if (dateRange !== option.value) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (dateRange !== option.value) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grafikler */}
          {selectedChild && chartData.length > 0 && chartReady && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {/* Zaman Bazlı Grafik */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                height: '350px',
                overflow: 'hidden'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.75rem',
                  textAlign: 'center'
                }}>Zaman Bazlı Performans</h3>
                <div style={{ height: '250px', width: '100%' }}>
                  <Line
                    data={{
                      labels: chartData.map(d => d.date),
                      datasets: [
                        {
                          label: 'Doğru',
                          data: chartData.map(d => d.doğru),
                          borderColor: '#10b981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          tension: 0.4
                        },
                        {
                          label: 'Yanlış',
                          data: chartData.map(d => d.yanlış),
                          borderColor: '#ef4444',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          tension: 0.4
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Konu Bazlı Başarı Grafiği */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                height: '350px',
                overflow: 'hidden'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.75rem',
                  textAlign: 'center'
                }}>Konu Bazlı Başarı</h3>
                <div style={{ height: '250px', width: '100%' }}>
                  <Bar
                    data={{
                      labels: conceptData.map(d => d.konu),
                      datasets: [
                        {
                          label: 'Başarı Oranı (%)',
                          data: conceptData.map(d => d.başarı),
                          backgroundColor: '#10b981',
                          borderRadius: 4,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Doğru/Yanlış Oranı */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                height: '350px',
                overflow: 'hidden'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.75rem',
                  textAlign: 'center'
                }}>Genel Performans</h3>
                <div style={{ height: '250px', width: '100%' }}>
                  <Doughnut
                    data={{
                      labels: performanceData.map(d => d.name),
                      datasets: [
                        {
                          data: performanceData.map(d => d.value),
                          backgroundColor: performanceData.map(d => d.color),
                          borderWidth: 2,
                          borderColor: '#ffffff',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rapor İstatistikleri */}
          {selectedChild && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Toplam Oyun
            </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#3b82f6'
                }}>
                  {reports.length}
              </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Doğru Cevap
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#10b981'
                }}>
                  {reports.reduce((sum, report) => sum + (report.correct_count || 0), 0)}
              </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Yanlış Cevap
            </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#ef4444'
                }}>
                  {reports.reduce((sum, report) => sum + (report.wrong_count || 0), 0)}
            </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Ortalama Tepki Süresi
              </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#f59e0b'
                }}>
                  {reports.length > 0 
                    ? (reports.reduce((sum, report) => sum + (report.avg_response_time_ms || 0), 0) / reports.length / 1000).toFixed(1)
                    : '0.0'} s
        </div>
          </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Başarı Oranı
          </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#8b5cf6'
                }}>
                  {(() => {
                    const totalCorrect = reports.reduce((sum, report) => sum + (report.correct_count || 0), 0);
                    const totalWrong = reports.reduce((sum, report) => sum + (report.wrong_count || 0), 0);
                    const total = totalCorrect + totalWrong;
                    return total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
                  })()}%
          </div>
        </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.1)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Farklı Konular
          </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#ec4899'
                }}>
                  {new Set(reports.map(report => report.concept)).size}
                </div>
              </div>
            </div>
          )}



          {/* Rapor Tablosu */}
          {selectedChild && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>Detaylı Raporlar</h3>
              
              {reports.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280'
                }}>
                  Bu tarih aralığında henüz oyun oynanmamış.
                </div>
              ) : (
                <div style={{
                  overflowX: 'auto'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem'
                  }}>
                  <thead>
                      <tr style={{
                        borderBottom: '2px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <th style={{
                          padding: '0.75rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>Tarih</th>
                        <th style={{
                          padding: '0.75rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>Oyun</th>
                        <th style={{
                          padding: '0.75rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>Konu</th>
                        <th style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>Doğru</th>
                        <th style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>Yanlış</th>
                        <th style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>Süre (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                      {reports.map((report, index) => (
                        <tr key={report.id} style={{
                          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                          backgroundColor: index % 2 === 0 ? 'rgba(59, 130, 246, 0.02)' : 'transparent'
                        }}>
                          <td style={{
                            padding: '0.75rem',
                            color: '#6b7280'
                          }}>
                            {new Date(report.created_at).toLocaleDateString('tr-TR')}
                          </td>
                          <td style={{
                            padding: '0.75rem',
                            color: '#1f2937',
                            fontWeight: '500'
                          }}>
                            {report.game_type === 'oyun1' ? 'Kavram Oyunu' : 
                             report.game_type === 'oyun2' ? 'Hafıza Oyunu' :
                             report.game_type === 'oyun3' ? 'Renk Oyunu' : report.game_type}
                          </td>
                          <td style={{
                            padding: '0.75rem',
                            color: '#1f2937'
                          }}>
                            {report.concept}
                          </td>
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'center',
                            color: '#10b981',
                            fontWeight: '600'
                          }}>
                            {report.correct_count || 0}
                          </td>
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'center',
                            color: '#ef4444',
                            fontWeight: '600'
                          }}>
                            {report.wrong_count || 0}
                          </td>
                          <td style={{
                            padding: '0.75rem',
                            textAlign: 'center',
                            color: '#6b7280'
                          }}>
                            {report.avg_response_time_ms || 0}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
        )}

      </div>
      </PortalLayout>
    </Fragment>
  );
};

export default RaporlarPage;