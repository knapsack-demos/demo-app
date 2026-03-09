import { useState, useEffect, useCallback } from 'react'
import { Button, Card, Text, Divider, Grid, Callout } from '@knapsack/sandbox-components/react'
import { Author, Badge, AnimatedAreaChart } from '@knapsack-cloud/demo'

type Department = 'All' | 'Engineering' | 'Design' | 'Product' | 'Marketing'
type Status = 'online' | 'away' | 'offline'

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  avatarMedium: string
  avatarLarge: string
  department: Exclude<Department, 'All'>
  role: string
  status: Status
  joinDate: string
  city: string
  activityData: Array<{ month: string; desktop: number }>
}

interface ActivityEvent {
  id: string
  memberName: string
  memberAvatar: string
  action: string
  timestamp: Date
}

const DEPARTMENTS: Exclude<Department, 'All'>[] = ['Engineering', 'Design', 'Product', 'Marketing']

const ROLES: Record<Exclude<Department, 'All'>, string[]> = {
  Engineering: ['Frontend Engineer', 'Backend Engineer', 'DevOps Engineer', 'QA Engineer'],
  Design: ['UX Designer', 'Visual Designer', 'Design Lead', 'Design Researcher'],
  Product: ['Product Manager', 'Product Owner', 'Strategy Lead', 'Data Analyst'],
  Marketing: ['Content Strategist', 'Growth Engineer', 'Brand Designer', 'Marketing Lead'],
}

const ACTIONS = [
  'pushed 3 commits to main',
  'reviewed a pull request',
  'opened a new issue',
  'merged a feature branch',
  'updated the design spec',
  'shipped a new feature',
  'closed 2 backlog tickets',
  'left a comment on a PR',
  'deployed to staging',
  'created a new component',
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const STATUS_CYCLE: Status[] = ['online', 'online', 'online', 'away', 'offline', 'online', 'away', 'online']

const STATUS_BADGE_VARIANT: Record<Status, 'success' | 'warning' | 'secondary'> = {
  online: 'success',
  away: 'warning',
  offline: 'secondary',
}

const DEPT_BADGE_VARIANT: Record<Exclude<Department, 'All'>, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  Engineering: 'default',
  Design: 'secondary',
  Product: 'outline',
  Marketing: 'destructive',
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateActivity(): Array<{ month: string; desktop: number }> {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now)
    d.setMonth(d.getMonth() - (5 - i))
    return { month: MONTHS[d.getMonth()], desktop: rand(8, 130) }
  })
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  return `${Math.floor(secs / 3600)}h ago`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMember(r: any, i: number): TeamMember {
  const department = DEPARTMENTS[i % DEPARTMENTS.length]
  const roles = ROLES[department]
  return {
    id: r.login.uuid,
    firstName: r.name.first,
    lastName: r.name.last,
    avatarMedium: r.picture.medium,
    avatarLarge: r.picture.large,
    department,
    role: roles[i % roles.length],
    status: STATUS_CYCLE[i % STATUS_CYCLE.length],
    joinDate: new Date(r.registered.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    city: `${r.location.city}, ${r.location.country}`,
    activityData: generateActivity(),
  }
}

export function TeamDirectory() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Department>('All')
  const [selected, setSelected] = useState<TeamMember | null>(null)
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [tick, setTick] = useState(0)

  const fetchTeam = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('https://randomuser.me/api/?results=8&nat=us,gb,au,ca')
      const data = await res.json()
      const mapped: TeamMember[] = data.results.map(mapMember)
      setMembers(mapped)
      setSelected(mapped[0])
      setActivities(
        mapped.slice(0, 5).map((m, i) => ({
          id: crypto.randomUUID(),
          memberName: `${m.firstName} ${m.lastName}`,
          memberAvatar: m.avatarMedium,
          action: ACTIONS[i % ACTIONS.length],
          timestamp: new Date(Date.now() - rand(60_000, 900_000)),
        }))
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTeam() }, [fetchTeam])

  useEffect(() => {
    if (members.length === 0) return
    const id = setInterval(() => {
      const m = members[rand(0, members.length - 1)]
      setActivities(prev => [
        {
          id: crypto.randomUUID(),
          memberName: `${m.firstName} ${m.lastName}`,
          memberAvatar: m.avatarMedium,
          action: ACTIONS[rand(0, ACTIONS.length - 1)],
          timestamp: new Date(),
        },
        ...prev,
      ].slice(0, 8))
    }, 5000)
    return () => clearInterval(id)
  }, [members])

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  void tick

  const filtered = filter === 'All' ? members : members.filter(m => m.department === filter)
  const onlineCount = members.filter(m => m.status === 'online').length
  const spotlight = members.find(m => m.status === 'online') ?? members[0]

  return (
    <div style={{ maxWidth: 900, width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div>
        <Text type="title">Team Directory</Text>
        <Text type="subtitle">Live profiles &amp; real-time activity</Text>
      </div>

      {spotlight && (
        <Callout
          heading={`Spotlight: ${spotlight.firstName} ${spotlight.lastName}`}
          body={`${spotlight.role} · ${spotlight.department} · Joined ${spotlight.joinDate} · ${spotlight.city}`}
          imageSrc={spotlight.avatarLarge}
          imageAlignment="left"
        >
          <div onClick={() => setSelected(spotlight)} style={{ cursor: 'pointer', display: 'inline-block' }}>
            <Button label="View Activity" size="small" type="filled" />
          </div>
        </Callout>
      )}

      <Divider spacingBottom="none" />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge variant="success">{onlineCount} online</Badge>
        <Badge variant="secondary">{members.length - onlineCount} away / offline</Badge>
        <Badge variant="default">{members.length} total</Badge>
        {DEPARTMENTS.map(d => (
          <Badge key={d} variant="outline">
            {members.filter(m => m.department === d).length} {d}
          </Badge>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {(['All', ...DEPARTMENTS] as Department[]).map(dept => (
          <div key={dept} onClick={() => setFilter(dept)} style={{ cursor: 'pointer' }}>
            <Button label={dept} size="small" type={filter === dept ? 'filled' : 'outlined'} />
          </div>
        ))}
        <div onClick={() => !loading && fetchTeam()} style={{ cursor: 'pointer', marginLeft: 'auto' }}>
          <Button
            label={loading ? 'Loading…' : 'Shuffle Team'}
            size="small"
            mode={loading ? 'default' : 'success'}
          />
        </div>
      </div>

      {loading ? (
        <Text type="body">Loading team members…</Text>
      ) : filtered.length === 0 ? (
        <Text type="body">No members in this department.</Text>
      ) : (
        <Grid key={filter} columns={2} gap="medium">
          {filtered.map(member => (
            <div
              key={member.id}
              onClick={() => setSelected(member)}
              style={{
                cursor: 'pointer',
                outline: selected?.id === member.id ? '2px solid var(--brand-color, #6366f1)' : 'none',
                borderRadius: 8,
                transition: 'outline 0.15s',
              }}
            >
              <Card title={`${member.firstName} ${member.lastName}`} description={member.role}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Author
                    imgSrc={member.avatarMedium}
                    date={member.city}
                    read={`Joined ${member.joinDate}`}
                    role={member.role}
                    noBorder
                  >
                    {member.firstName} {member.lastName}
                  </Author>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <Badge variant={STATUS_BADGE_VARIANT[member.status]}>{member.status}</Badge>
                    <Badge variant={DEPT_BADGE_VARIANT[member.department]}>{member.department}</Badge>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </Grid>
      )}

      <Divider spacingBottom="none" />

      {selected && (
        <>
          <Text type="headingMedium" spacingBottom="small">
            Activity — {selected.firstName} {selected.lastName}
          </Text>
          <AnimatedAreaChart
            data={selected.activityData}
            config={{ desktop: { label: 'Commits', color: 'var(--brand-color, #6366f1)' } }}
            title={`${selected.firstName}'s Contributions`}
            description="Commits over the last 6 months"
            dateRange={`${selected.activityData[0]?.month} – ${selected.activityData[5]?.month}`}
            trendText="Click any team card to explore their history"
          />
        </>
      )}

      <Divider spacingBottom="none" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="headingMedium" spacingBottom="none">Live Activity</Text>
        <Badge variant="success">● Live</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {activities.map((event, i) => (
          <div key={event.id}>
            <div style={{ padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Author imgSrc={event.memberAvatar} date={timeAgo(event.timestamp)} read="" noBorder>
                {event.memberName}
              </Author>
              <Text type="body">{event.memberName} {event.action}</Text>
            </div>
            {i < activities.length - 1 && <Divider spacingBottom="none" />}
          </div>
        ))}
      </div>

    </div>
  )
}
