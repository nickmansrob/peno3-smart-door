
// Restrictions
export type IncomingRestriction = {
  day: Day
  kind: RestrictionKind
  interval: CustomInterval
  restriction: UserRestriction | GroupRestriction
}

export type RestrictionKind = 'USER' | 'GROUP'

export type DayInterval<T> = Record<Day, T>


export type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'
