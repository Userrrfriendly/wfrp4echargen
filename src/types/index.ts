export interface ApiEntity<T> {
  id: string;
  canEdit: boolean;
  ownerId: string;
  object: T;
}

export interface ApiResponse<T> {
  data: T[];
}

export interface AttributeModifiers {
  Ag: number;
  BS: number;
  Dex: number;
  Fel: number;
  I: number;
  Int: number;
  S: number;
  T: number;
  WP: number;
  WS: number;
}

export interface EntityModifiers {
  attributes: AttributeModifiers;
  effects: unknown[];
  movement: number;
  size: number;
}

// --- Career ---

export interface CareerLevelData {
  exists: boolean;
  name: string;
  attributes: number[];
  skills: string[];
  talents: string[];
  items: string;
  standing: number;
  status: number;
}

export interface CareerData {
  name: string;
  description: string;
  class: number;
  species: number[];
  shared: boolean;
  source: Record<string, string>;
  level1: CareerLevelData;
  level2: CareerLevelData;
  level3: CareerLevelData;
  level4: CareerLevelData;
  level5: CareerLevelData;
}

export type Career = ApiEntity<CareerData>;

// --- Skill ---

export interface SkillData {
  name: string;
  description: string;
  attribute: number;
  displayZero: boolean;
  group: string[];
  isGroup: boolean;
  shared: boolean;
  source: Record<string, string>;
  type: number;
}

export type Skill = ApiEntity<SkillData>;

// --- Talent ---

export interface TalentData {
  name: string;
  description: string;
  attribute: number;
  attribute2: number;
  group: string[];
  isGroup: boolean;
  maxRank: number;
  modifiers: EntityModifiers;
  shared: boolean;
  source: Record<string, string>;
  tests: string;
}

export type Talent = ApiEntity<TalentData>;

// --- Trait ---

export interface TraitData {
  name: string;
  description: string;
  modifiers: EntityModifiers;
  shared: boolean;
  source: Record<string, string>;
}

export type Trait = ApiEntity<TraitData>;

// --- Trapping ---

export interface TrappingMeleeData {
  dmg: number;
  dmgSbMult: number;
  group: number;
  hands: number;
  reach: number;
}

export interface TrappingRangedData {
  dmg: number;
  dmgSbMult: number;
  group: number;
  hands: number;
  rng: number;
  rngSbMult: number;
}

export interface TrappingArmourData {
  group: number;
  location: number[];
  points: number;
}

export interface TrappingAmmunitionData {
  dmg: number;
  group: number;
  rng: number;
  rngMult: number;
}

export interface TrappingData {
  name: string;
  description: string;
  type: number;
  availability: number;
  enc: number;
  price: number;
  properties: string[];
  runes: string[];
  shared: boolean;
  source: Record<string, string>;
  melee: TrappingMeleeData;
  ranged: TrappingRangedData;
  armour: TrappingArmourData;
  ammunition: TrappingAmmunitionData;
  container: { capacity: number; carryType: number };
  grimoire: { spells: string[] };
  other: { carryType: number };
}

export type Trapping = ApiEntity<TrappingData>;

// --- Spell ---

export interface SpellClassification {
  labels: number[];
  type: number;
}

export interface SpellData {
  name: string;
  description: string;
  cn: number;
  range: string;
  target: string;
  duration: string;
  classification: SpellClassification;
  shared: boolean;
  source: Record<string, string>;
}

export type Spell = ApiEntity<SpellData>;

// --- Prayer ---

export interface PrayerData {
  name: string;
  description: string;
  range: string;
  target: string;
  duration: string;
  shared: boolean;
  source: Record<string, string>;
}

export type Prayer = ApiEntity<PrayerData>;

// --- Mutation ---

export interface MutationData {
  name: string;
  description: string;
  type: number;
  modifiers: EntityModifiers;
  shared: boolean;
  source: Record<string, string>;
}

export type Mutation = ApiEntity<MutationData>;

// --- Quality ---

export interface QualityData {
  name: string;
  description: string;
  type: number;
  applicableTo: number[];
  shared: boolean;
  source: Record<string, string>;
}

export type Quality = ApiEntity<QualityData>;

// --- Rune ---

export interface RuneData {
  name: string;
  description: string;
  applicableTo: number[];
  labels: number[];
  shared: boolean;
  source: Record<string, string>;
}

export type Rune = ApiEntity<RuneData>;
