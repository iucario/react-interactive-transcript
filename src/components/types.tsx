export type Cue = {
  __typename: 'Cue'
  text: string
  time: number
}

export type Paragraph = {
  __typename: 'Paragraph'
  cues: Array<Cue>
}

export type Transcript = Paragraph[]

export type CueInterval = {
  start: number
  end: number
  text: string
}

export type Track = {
  title: string
  src: string
  author: string
  transcript?: Transcript | undefined
  thumbnail?: string | undefined
}
