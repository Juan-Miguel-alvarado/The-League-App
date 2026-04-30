import { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Dashboard } from '@/pages/Dashboard'
import { Standings } from '@/pages/Standings'
import { Teams } from '@/pages/Teams'
import { Scorers } from '@/pages/Scorers'
import { Statistics } from '@/pages/Statistics'
import { TeamDetail } from '@/pages/TeamDetail'
import { PlayerDetail } from '@/pages/PlayerDetail'
import { Button } from '@/components/ui/button'
import { loadAllData } from '@/api/football'
import { useTheme } from '@/hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()

  const [state, setState] = useState({ standings: [], scorers: [], matches: [] })
  const [page, setPage] = useState('home')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState(0)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  useEffect(() => {
    loadAllData()
      .then(data => { setState(data); setStatus('ready') })
      .catch(err => { setError(err.message); setStatus('error') })
  }, [])

  function navigate(p, data) {
    if (p === 'team') {
      const team = state.standings.find(t => t.name === data)
      if (team) setSelectedTeam(team)
    }
    if (p === 'player') setSelectedPlayerIdx(typeof data === 'number' ? data : 0)
    setPage(p)
    document.getElementById('main-content')?.scrollTo(0, 0)
  }

  const { standings, scorers, matches } = state

  const pageProps = { standings, scorers, matches, onNavigate: navigate }

  const pages = {
    home:    <Dashboard {...pageProps} />,
    table:   <Standings standings={standings} onNavigate={navigate} />,
    teams:   <Teams standings={standings} onNavigate={navigate} />,
    scorers: <Scorers scorers={scorers} onNavigate={navigate} />,
    stats:   <Statistics standings={standings} />,
    team:    <TeamDetail team={selectedTeam} standings={standings} scorers={scorers} onNavigate={navigate} />,
    player:  <PlayerDetail playerIdx={selectedPlayerIdx} scorers={scorers} standings={standings} onNavigate={navigate} />,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar currentPage={page} onNavigate={navigate} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          currentPage={page}
          standings={standings}
          scorers={scorers}
          theme={theme}
          onThemeToggle={toggle}
          onNavigate={navigate}
        />

        <main id="main-content" className="flex-1 overflow-y-auto">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <div className="spinner" />
              <p className="text-sm text-muted-foreground">Cargando datos de LaLiga...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
              <AlertTriangle size={32} className="text-muted-foreground" />
              <p className="text-base font-medium">Error al cargar datos</p>
              <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
              {(error.includes('403') || error.includes('401') || error.toLowerCase().includes('api')) && (
                <div className="mt-2 p-4 bg-card border border-border rounded-xl text-xs text-left max-w-sm text-muted-foreground">
                  <strong className="text-foreground block mb-2">Verifica que el servidor proxy esté corriendo</strong>
                  Ejecuta: <code className="bg-accent px-1.5 py-0.5 rounded">npm run server</code> en otra terminal.
                </div>
              )}
              <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={() => location.reload()}>
                <RefreshCw size={14} /> Reintentar
              </Button>
            </div>
          )}

          {status === 'ready' && (pages[page] || pages.home)}
        </main>
      </div>
    </div>
  )
}
