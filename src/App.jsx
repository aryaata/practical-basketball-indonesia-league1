import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Menu, X, Trophy, Users, Calendar, Clock, BookOpen, Search, ChevronDown, ChevronRight,
  Copy, Check, ExternalLink, Crown, Flag, Palette, Mic, Globe, ArrowUp, ArrowDown,
  ArrowUpDown, MapPin, Server, Wifi, Gamepad2, UserCheck, Gavel, MessageCircle,
  Target, Activity, Tv, Flame, ArrowUpRight, Award,
} from "lucide-react";

/* ============================================================================
 * LEAGUE_CONFIG
 * ----------------------------------------------------------------------------
 * Everything the UI renders comes from this one object. To go live, replace the
 * placeholder data below (keep the same field names) and leave the components
 * untouched.
 *
 *  - robloxUserId : numeric Roblox user ID (used for headshot thumbnails).
 *                   Placeholder IDs are fake; if a thumbnail can't load the UI
 *                   falls back to a stylised initials avatar automatically.
 *  - teams[].id   : lowercase key used by schedule[].home / .away and
 *                   statLeaders[].teamId.
 *  - schedule[]   : status = "final" | "live" | "upcoming".
 *  - asOfDate     : "today" for the schedule labels (YYYY-MM-DD).
 * ========================================================================== */
const LEAGUE_CONFIG = {
  leagueName: "Indonesia Practical Basketball League",
  leagueShortName: "IPBL",
  leagueTagline: "Run the Archipelago.",
  leagueBlurb:
    "The premier competitive Practical Basketball league in Indonesia. Ten franchises, a real draft, real stakes: run by a dedicated staff, broadcast live, and played on the most authentic hardwood Roblox has to offer.",
  seasonLabel: "Season 1",
  seasonPhase: "Regular Season",
  asOfDate: "2026-11-20",
  discordInviteUrl: "https://discord.gg/your-invite",
  robloxGroupUrl: "https://www.roblox.com/communities/0000000/IPBL",
  accentColor: "#f97316", // court orange
  secondaryAccent: "#38bdf8", // electric cyan
  prizePool: "R$ 250,000",
  prizePoolNote: "+ MVP, DPOY & ROY awards",

  // Role colours used for staff pills (department -> hex)
  departmentColors: {
    Commissioners: "#f97316",
    Referees: "#38bdf8",
    "Media & GFX": "#a78bfa",
    Streamers: "#f472b6",
  },

  /* ------------------------------------------------------------------ STAFF */
  staff: [
    { id: "st-01", robloxUsername: "CommishKaelan", displayName: "Kaelan", robloxUserId: 3184726509, discordTag: "kaelan.commish", role: "League Commissioner", department: "Commissioners", region: "WIB · UTC+7", bio: "Founded the league and oversees season operations, expansion, and the competitive vision for IPBL." },
    { id: "st-02", robloxUsername: "DeputyDimas", displayName: "Dimas", robloxUserId: 2750194836, discordTag: "dimas.deputy", role: "Deputy Commissioner", department: "Commissioners", region: "WIB · UTC+7", bio: "Runs the draft, trades and free-agency desk. First stop for roster disputes and eligibility rulings." },
    { id: "st-03", robloxUsername: "OpsOfficerLarasati", displayName: "Larasati", robloxUserId: 4096127385, discordTag: "laras.ops", role: "Director of Operations", department: "Commissioners", region: "WITA · UTC+8", bio: "Builds the schedule, coordinates server hosts, and keeps every game night running on time." },
    { id: "st-04", robloxUsername: "HeadRefBimaWhistle", displayName: "Bima", robloxUserId: 1936482057, discordTag: "bima.whistle", role: "Head Referee", department: "Referees", region: "WIB · UTC+7", bio: "Trains and evaluates every official. Final word on protests and rule interpretations." },
    { id: "st-05", robloxUsername: "ZebraZaki", displayName: "Zaki", robloxUserId: 3620518472, discordTag: "zaki.zebra", role: "Senior Referee", department: "Referees", region: "WIB · UTC+7", bio: "Veteran official with 200+ games on the whistle. Handles marquee primetime matchups." },
    { id: "st-06", robloxUsername: "CallItClean_Nadia", displayName: "Nadia", robloxUserId: 2271059834, discordTag: "nadia.calls", role: "Referee", department: "Referees", region: "WITA · UTC+8", bio: "Known for clean, consistent calls and calm communication with captains." },
    { id: "st-07", robloxUsername: "FoulOrNotFarrel", displayName: "Farrel", robloxUserId: 4418203761, discordTag: "farrel.refs", role: "Referee", department: "Referees", region: "WIT · UTC+9", bio: "Covers late-night and eastern-region games, specialising in ping and disconnect rulings." },
    { id: "st-08", robloxUsername: "BaselineBaskara", displayName: "Baskara", robloxUserId: 1583907246, discordTag: "baskara.baseline", role: "Referee", department: "Referees", region: "WIB · UTC+7", bio: "Rising official focused on shot-clock enforcement and out-of-bounds review." },
    { id: "st-09", robloxUsername: "PixelPressPrisha", displayName: "Prisha", robloxUserId: 3907125648, discordTag: "prisha.pixel", role: "Head of Media", department: "Media & GFX", region: "WIB · UTC+7", bio: "Directs the league's brand, announcements and weekly content calendar." },
    { id: "st-10", robloxUsername: "VectorVandalVito", displayName: "Vito", robloxUserId: 2084716395, discordTag: "vito.vector", role: "Lead GFX Designer", department: "Media & GFX", region: "WIB · UTC+7", bio: "Designs franchise crests, scorebugs, and every graphic that hits the broadcast." },
    { id: "st-11", robloxUsername: "MotionMaverickMira", displayName: "Mira", robloxUserId: 4731850926, discordTag: "mira.motion", role: "Motion Designer", department: "Media & GFX", region: "WITA · UTC+8", bio: "Animates intros, player cards and highlight packages." },
    { id: "st-12", robloxUsername: "ClipCutterCahya", displayName: "Cahya", robloxUserId: 1295063784, discordTag: "cahya.clips", role: "Social Media Manager", department: "Media & GFX", region: "WIB · UTC+7", bio: "Cuts highlights within minutes of the final buzzer and runs league socials." },
    { id: "st-13", robloxUsername: "CourtsideCaster_Ravi", displayName: "Ravi", robloxUserId: 3358190472, discordTag: "ravi.live", role: "Lead Broadcaster", department: "Streamers", region: "WIB · UTC+7", bio: "The voice of IPBL. Calls the Game of the Week and hosts the weekly power rankings." },
    { id: "st-14", robloxUsername: "PlayByPlayPutri", displayName: "Putri", robloxUserId: 2619407835, discordTag: "putri.pbp", role: "Play-by-Play Commentator", department: "Streamers", region: "WIB · UTC+7", bio: "High-energy play-by-play with an encyclopedic memory for league history." },
    { id: "st-15", robloxUsername: "ColorCommentaryCandra", displayName: "Candra", robloxUserId: 4175286093, discordTag: "candra.color", role: "Color Analyst", department: "Streamers", region: "WITA · UTC+8", bio: "Breaks down plays, schemes and matchups with a former-captain's eye." },
    { id: "st-16", robloxUsername: "StreamDeckSabrina", displayName: "Sabrina", robloxUserId: 1847350629, discordTag: "sabrina.deck", role: "Stream Producer", department: "Streamers", region: "WIB · UTC+7", bio: "Runs the control room: scenes, replays, overlays and every live cue." },
  ],

  /* ------------------------------------------------------------------ TEAMS */
  teams: [
    // ---- Western Conference
    { id: "jkt", name: "Jakarta Garuda", abbreviation: "JKT", conference: "Western", primaryColor: "#e11d48", wins: 10, losses: 2, pointsFor: 1002, pointsAgainst: 861, streak: "W6", gm: "RafiTheArchitect",
      roster: [
        { username: "xVortexHoops", position: "PG", number: 1, role: "Captain" },
        { username: "KurokoHandles", position: "SG", number: 7, role: "Starter" },
        { username: "NaufalSplash3", position: "SF", number: 23, role: "Starter" },
        { username: "BigBenBoards", position: "PF", number: 34, role: "Starter" },
        { username: "RimProtectorRizky", position: "C", number: 50, role: "Starter" },
        { username: "ClutchGene_", position: "PG", number: 12, role: "Sixth Man" },
        { username: "GlassCleanerGio", position: "PF", number: 44, role: "Bench" },
      ] },
    { id: "bdg", name: "Bandung Blaze", abbreviation: "BDG", conference: "Western", primaryColor: "#ec4899", wins: 8, losses: 4, pointsFor: 951, pointsAgainst: 884, streak: "L1", gm: "BlazeBossBagas",
      roster: [
        { username: "FlameThrowerFajar", position: "PG", number: 4, role: "Captain" },
        { username: "IgnitedIvan", position: "SG", number: 10, role: "Starter" },
        { username: "CinderCutterCakra", position: "SF", number: 27, role: "Starter" },
        { username: "InfernoInsideIlyas", position: "PF", number: 38, role: "Starter" },
        { username: "EmberEnforcerEko", position: "C", number: 56, role: "Starter" },
        { username: "SparkPlugSabda", position: "PG", number: 14, role: "Sixth Man" },
        { username: "AshenAimAris", position: "SG", number: 31, role: "Bench" },
      ] },
    { id: "mdn", name: "Medan Monarchs", abbreviation: "MDN", conference: "Western", primaryColor: "#cbd5e1", wins: 5, losses: 7, pointsFor: 893, pointsAgainst: 921, streak: "W1", gm: "KingMedanKevin",
      roster: [
        { username: "CrownedCrossoverCleo", position: "PG", number: 9, role: "Captain" },
        { username: "RoyalFlushRaka", position: "SG", number: 15, role: "Starter" },
        { username: "ScepterSwishSam", position: "SF", number: 26, role: "Starter" },
        { username: "ThroneBoardsTama", position: "PF", number: 37, role: "Starter" },
        { username: "FortressFaiz", position: "C", number: 51, role: "Starter" },
        { username: "KnightMovesKaito", position: "SG", number: 3, role: "Sixth Man" },
        { username: "JesterJumperJoe", position: "PF", number: 43, role: "Bench" },
      ] },
    { id: "plm", name: "Palembang Phantoms", abbreviation: "PLM", conference: "Western", primaryColor: "#14b8a6", wins: 4, losses: 8, pointsFor: 861, pointsAgainst: 934, streak: "W1", gm: "SriwijayaStrategist",
      roster: [
        { username: "GhostHandsGani", position: "PG", number: 11, role: "Captain" },
        { username: "PhantomPullupPaul", position: "SG", number: 6, role: "Starter" },
        { username: "SpecterSwingmanSyam", position: "SF", number: 21, role: "Starter" },
        { username: "ApparitionAlley", position: "PF", number: 30, role: "Starter" },
        { username: "WraithWallWahid", position: "C", number: 53, role: "Starter" },
        { username: "ShadowStepSeth", position: "PG", number: 1, role: "Sixth Man" },
        { username: "SpiritSplashSabil", position: "SG", number: 29, role: "Bench" },
      ] },
    { id: "bgr", name: "Bogor Hornets", abbreviation: "BGR", conference: "Western", primaryColor: "#facc15", wins: 2, losses: 10, pointsFor: 820, pointsAgainst: 946, streak: "L5", gm: "StingerStaffZidan",
      roster: [
        { username: "BuzzerBeaterBrian", position: "PG", number: 8, role: "Captain" },
        { username: "StingStrokeSultan", position: "SG", number: 12, role: "Starter" },
        { username: "SwarmSwingmanSenna", position: "SF", number: 20, role: "Starter" },
        { username: "HiveHeavyHendra", position: "PF", number: 42, role: "Starter" },
        { username: "PollenPostPandu", position: "C", number: 57, role: "Starter" },
        { username: "DroneDribbleDion", position: "PG", number: 3, role: "Sixth Man" },
        { username: "WaspWingWildan", position: "SF", number: 16, role: "Bench" },
      ] },
    // ---- Eastern Conference
    { id: "sby", name: "Surabaya Vipers", abbreviation: "SBY", conference: "Eastern", primaryColor: "#22c55e", wins: 9, losses: 3, pointsFor: 978, pointsAgainst: 872, streak: "W4", gm: "ViperCommanderDhika",
      roster: [
        { username: "SnakeEyesSteph", position: "PG", number: 3, role: "Captain" },
        { username: "ColdBloodedKlay", position: "SG", number: 11, role: "Starter" },
        { username: "VenomVince_", position: "SF", number: 15, role: "Starter" },
        { username: "PostUpPoseidon", position: "PF", number: 32, role: "Starter" },
        { username: "ConstrictorCenter", position: "C", number: 21, role: "Starter" },
        { username: "HandleGodHaikal", position: "PG", number: 5, role: "Sixth Man" },
        { username: "LockdownLeo", position: "SF", number: 9, role: "Bench" },
      ] },
    { id: "bal", name: "Bali Typhoons", abbreviation: "BAL", conference: "Eastern", primaryColor: "#0ea5e9", wins: 7, losses: 5, pointsFor: 930, pointsAgainst: 905, streak: "W2", gm: "TyphoonTheGM",
      roster: [
        { username: "DimeDropper99", position: "PG", number: 10, role: "Captain" },
        { username: "SurfsUpSharpshooter", position: "SG", number: 14, role: "Starter" },
        { username: "DunkOnYouDewa", position: "SF", number: 24, role: "Starter" },
        { username: "TsunamiTito", position: "PF", number: 33, role: "Starter" },
        { username: "IslandBigmanIdris", position: "C", number: 45, role: "Starter" },
        { username: "SplashBrotherSeno", position: "SG", number: 2, role: "Sixth Man" },
        { username: "HurricaneHandsHafiz", position: "PF", number: 41, role: "Bench" },
      ] },
    { id: "mks", name: "Makassar Mavericks", abbreviation: "MKS", conference: "Eastern", primaryColor: "#f59e0b", wins: 7, losses: 5, pointsFor: 918, pointsAgainst: 899, streak: "L1", gm: "MakassarMogulAndi",
      roster: [
        { username: "PhinisiPlaymaker", position: "PG", number: 6, role: "Captain" },
        { username: "CoastalCrossoverCaca", position: "SG", number: 13, role: "Starter" },
        { username: "BugisBucketsBayu", position: "SF", number: 22, role: "Starter" },
        { username: "RingBreakerRian", position: "PF", number: 35, role: "Starter" },
        { username: "AnchorBigAnwar", position: "C", number: 52, role: "Starter" },
        { username: "FastBreakFarel", position: "PG", number: 4, role: "Sixth Man" },
        { username: "CornerThreeCandra", position: "SG", number: 19, role: "Bench" },
      ] },
    { id: "mnd", name: "Manado Mariners", abbreviation: "MND", conference: "Eastern", primaryColor: "#2563eb", wins: 5, losses: 7, pointsFor: 880, pointsAgainst: 902, streak: "L2", gm: "CaptainManadoYoga",
      roster: [
        { username: "NorthernLightsNoel", position: "PG", number: 0, role: "Captain" },
        { username: "TidePoolShooter", position: "SG", number: 17, role: "Starter" },
        { username: "AnchorUpArya", position: "SF", number: 25, role: "Starter" },
        { username: "SeaWallSteven", position: "PF", number: 31, role: "Starter" },
        { username: "DeepWaterDaniel", position: "C", number: 54, role: "Starter" },
        { username: "BuoyBuckets", position: "SG", number: 20, role: "Sixth Man" },
        { username: "LighthouseLuke", position: "SF", number: 8, role: "Bench" },
      ] },
    { id: "mlg", name: "Malang Wolves", abbreviation: "MLG", conference: "Eastern", primaryColor: "#8b5cf6", wins: 3, losses: 9, pointsFor: 842, pointsAgainst: 951, streak: "L3", gm: "AppleCityAkbar",
      roster: [
        { username: "AlphaWolfAdit", position: "PG", number: 2, role: "Captain" },
        { username: "NightHowlNico", position: "SG", number: 16, role: "Starter" },
        { username: "PackLeaderPutra", position: "SF", number: 28, role: "Starter" },
        { username: "FangsOutFikri", position: "PF", number: 40, role: "Starter" },
        { username: "IronJawIlham", position: "C", number: 55, role: "Starter" },
        { username: "WolfPupWahyu", position: "PG", number: 7, role: "Sixth Man" },
        { username: "HowlingHoopsHanif", position: "SF", number: 18, role: "Bench" },
      ] },
  ],

  /* --------------------------------------------------------------- SCHEDULE */
  schedule: [
    // ---- Completed
    { id: "g-101", status: "final", date: "2026-11-19", time: "20:00", tz: "WIB", home: "sby", away: "mlg", homeScore: 84, awayScore: 71, homeQ: [22, 20, 18, 24], awayQ: [17, 19, 16, 19], mvp: "SnakeEyesSteph", mvpLine: "31 PTS · 7 AST · 3 STL", court: "Practical Court A", server: "Singapore", stream: { status: "vod", channel: "IPBL TV", url: "https://twitch.tv/" } },
    { id: "g-102", status: "final", date: "2026-11-19", time: "21:30", tz: "WIB", home: "jkt", away: "bgr", homeScore: 92, awayScore: 68, homeQ: [26, 22, 20, 24], awayQ: [15, 18, 17, 18], mvp: "xVortexHoops", mvpLine: "34 PTS · 8 AST · 2 STL", court: "Practical Court A", server: "Singapore", stream: { status: "vod", channel: "IPBL TV", url: "https://twitch.tv/" } },
    { id: "g-103", status: "final", date: "2026-11-18", time: "20:00", tz: "WIB", home: "bdg", away: "mdn", homeScore: 79, awayScore: 82, homeQ: [20, 17, 21, 21], awayQ: [19, 22, 18, 23], mvp: "CrownedCrossoverCleo", mvpLine: "27 PTS · 9 AST · 2 STL", court: "Practical Court B", server: "Singapore", stream: { status: "none" } },
    { id: "g-104", status: "final", date: "2026-11-18", time: "21:30", tz: "WIB", home: "bal", away: "mks", homeScore: 77, awayScore: 74, homeQ: [18, 21, 19, 19], awayQ: [20, 17, 16, 21], mvp: "DimeDropper99", mvpLine: "18 PTS · 14 AST", court: "Practical Court A", server: "Singapore", stream: { status: "vod", channel: "IPBL TV", url: "https://twitch.tv/" } },
    { id: "g-105", status: "final", date: "2026-11-17", time: "20:00", tz: "WIB", home: "plm", away: "mnd", homeScore: 81, awayScore: 76, homeQ: [19, 22, 20, 20], awayQ: [18, 19, 21, 18], mvp: "WraithWallWahid", mvpLine: "19 PTS · 12 REB · 5 BLK", court: "Practical Court B", server: "Singapore", stream: { status: "none" } },
    { id: "g-106", status: "final", date: "2026-11-16", time: "20:30", tz: "WIB", home: "mks", away: "mlg", homeScore: 88, awayScore: 73, homeQ: [23, 22, 19, 24], awayQ: [18, 17, 20, 18], mvp: "CornerThreeCandra", mvpLine: "26 PTS · 6 3PM", court: "Practical Court A", server: "Singapore", stream: { status: "none" } },
    { id: "g-107", status: "final", date: "2026-11-15", time: "20:00", tz: "WIB", home: "jkt", away: "sby", homeScore: 85, awayScore: 83, homeQ: [21, 23, 19, 22], awayQ: [24, 18, 20, 21], mvp: "RimProtectorRizky", mvpLine: "22 PTS · 17 REB · 4 BLK", court: "Practical Court A", server: "Singapore", stream: { status: "vod", channel: "IPBL TV", url: "https://twitch.tv/" } },
    // ---- Live
    { id: "g-201", status: "live", date: "2026-11-20", time: "18:30", tz: "WIB", home: "sby", away: "bdg", homeScore: 58, awayScore: 61, quarter: "Q3", clock: "4:12", court: "Practical Court A", server: "Singapore", stream: { status: "live", channel: "IPBL TV", url: "https://twitch.tv/" } },
    // ---- Upcoming
    { id: "g-202", status: "upcoming", date: "2026-11-20", time: "20:30", tz: "WIB", home: "jkt", away: "mlg", court: "Practical Court A", server: "Singapore", stream: { status: "scheduled", channel: "IPBL TV", url: "https://twitch.tv/" } },
    { id: "g-203", status: "upcoming", date: "2026-11-21", time: "19:00", tz: "WIB", home: "bal", away: "mdn", court: "Practical Court B", server: "Singapore", stream: { status: "scheduled", channel: "IPBL TV", url: "https://twitch.tv/" } },
    { id: "g-204", status: "upcoming", date: "2026-11-21", time: "20:30", tz: "WIB", home: "mks", away: "plm", court: "Practical Court A", server: "Singapore", stream: { status: "none" } },
    { id: "g-205", status: "upcoming", date: "2026-11-22", time: "19:00", tz: "WIB", home: "mnd", away: "bgr", court: "Practical Court B", server: "Singapore", stream: { status: "none" } },
    { id: "g-206", status: "upcoming", date: "2026-11-22", time: "20:30", tz: "WIB", home: "sby", away: "jkt", featured: "Game of the Week", court: "Practical Court A", server: "Singapore", stream: { status: "scheduled", channel: "IPBL TV", url: "https://twitch.tv/" } },
    { id: "g-207", status: "upcoming", date: "2026-11-24", time: "19:30", tz: "WIB", home: "bdg", away: "mlg", court: "Practical Court B", server: "Singapore", stream: { status: "scheduled", channel: "IPBL TV", url: "https://twitch.tv/" } },
    { id: "g-208", status: "upcoming", date: "2026-11-25", time: "20:00", tz: "WIB", home: "plm", away: "bal", court: "Practical Court A", server: "Singapore", stream: { status: "none" } },
  ],

  /* ----------------------------------------------------------- STAT LEADERS */
  statCategories: [
    { key: "PPG", label: "Points", full: "Points per game", decimals: 1, suffix: "" },
    { key: "APG", label: "Assists", full: "Assists per game", decimals: 1, suffix: "" },
    { key: "RPG", label: "Rebounds", full: "Rebounds per game", decimals: 1, suffix: "" },
    { key: "SPG", label: "Steals", full: "Steals per game", decimals: 1, suffix: "" },
    { key: "BPG", label: "Blocks", full: "Blocks per game", decimals: 1, suffix: "" },
    { key: "3P%", label: "Three-Point %", full: "Three-point percentage", decimals: 1, suffix: "%" },
  ],
  statLeaders: {
    PPG: [
      { username: "xVortexHoops", robloxUserId: 4821937650, teamId: "jkt", gp: 12, value: 27.8 },
      { username: "SnakeEyesSteph", teamId: "sby", gp: 12, value: 25.3 },
      { username: "FlameThrowerFajar", teamId: "bdg", gp: 12, value: 24.1 },
      { username: "DimeDropper99", teamId: "bal", gp: 11, value: 22.9 },
      { username: "PhinisiPlaymaker", teamId: "mks", gp: 12, value: 21.6 },
    ],
    APG: [
      { username: "DimeDropper99", robloxUserId: 3015284769, teamId: "bal", gp: 11, value: 9.4 },
      { username: "HandleGodHaikal", teamId: "sby", gp: 12, value: 8.1 },
      { username: "xVortexHoops", teamId: "jkt", gp: 12, value: 7.6 },
      { username: "GhostHandsGani", teamId: "plm", gp: 12, value: 7.2 },
      { username: "CrownedCrossoverCleo", teamId: "mdn", gp: 12, value: 6.8 },
    ],
    RPG: [
      { username: "RimProtectorRizky", robloxUserId: 2490831675, teamId: "jkt", gp: 12, value: 13.2 },
      { username: "IslandBigmanIdris", teamId: "bal", gp: 12, value: 12.6 },
      { username: "AnchorBigAnwar", teamId: "mks", gp: 12, value: 11.9 },
      { username: "IronJawIlham", teamId: "mlg", gp: 12, value: 11.4 },
      { username: "FortressFaiz", teamId: "mdn", gp: 11, value: 10.7 },
    ],
    SPG: [
      { username: "LockdownLeo", robloxUserId: 1768305924, teamId: "sby", gp: 12, value: 3.2 },
      { username: "ShadowStepSeth", teamId: "plm", gp: 12, value: 2.9 },
      { username: "KurokoHandles", teamId: "jkt", gp: 12, value: 2.7 },
      { username: "NorthernLightsNoel", teamId: "mnd", gp: 12, value: 2.5 },
      { username: "DroneDribbleDion", teamId: "bgr", gp: 10, value: 2.3 },
    ],
    BPG: [
      { username: "RimProtectorRizky", robloxUserId: 2490831675, teamId: "jkt", gp: 12, value: 3.4 },
      { username: "WraithWallWahid", teamId: "plm", gp: 12, value: 3.0 },
      { username: "DeepWaterDaniel", teamId: "mnd", gp: 12, value: 2.8 },
      { username: "EmberEnforcerEko", teamId: "bdg", gp: 12, value: 2.6 },
      { username: "PollenPostPandu", teamId: "bgr", gp: 12, value: 2.2 },
    ],
    "3P%": [
      { username: "CornerThreeCandra", robloxUserId: 3872056149, teamId: "mks", gp: 12, value: 48.7 },
      { username: "SurfsUpSharpshooter", teamId: "bal", gp: 12, value: 46.9 },
      { username: "TidePoolShooter", teamId: "mnd", gp: 12, value: 45.2 },
      { username: "PhantomPullupPaul", teamId: "plm", gp: 12, value: 44.1 },
      { username: "KurokoHandles", teamId: "jkt", gp: 12, value: 43.6 },
    ],
  },

  /* ------------------------------------------------------------------ RULES */
  rules: [
    {
      id: "gameplay", title: "Gameplay & Court Settings", icon: "gameplay",
      summary: "How a game is played on the official Practical Basketball court.",
      items: [
        { id: "gp-1", title: "Game format & clock", body: "Games are 5v5 and played in four 6-minute quarters with a 2-minute break at halftime. The clock runs continuously except for timeouts, fouls and dead balls in the final 60 seconds of the fourth quarter. Tied games go to 3-minute overtime periods until a winner is decided." },
        { id: "gp-2", title: "Shot clock", body: "A 24-second shot clock is enforced using the league's server overlay. If the overlay is unavailable, referees call violations manually and their count is final. The clock resets to 14 seconds after an offensive rebound." },
        { id: "gp-3", title: "Stamina & substitutions", body: "Stamina must remain enabled. Exploiting stamina glitches, such as sprint-cancelling or animation-resetting tricks, is prohibited. Substitutions are made on dead balls only; a team may sub as many players as needed during a stoppage." },
        { id: "gp-4", title: "Court, ball & physics", body: "All games use the standard Practical Basketball court and regulation ball with default physics. Custom scripts, modified game settings, macros and auto-clickers are strictly prohibited and result in disqualification for the game." },
        { id: "gp-5", title: "Fouls & bonus", body: "A player fouls out after 6 personal fouls. Once a team commits 5 fouls in a quarter, the opposing team enters the bonus and shoots free throws on every non-shooting foul. Flagrant and unsportsmanlike fouls carry 2 shots and possession." },
      ],
    },
    {
      id: "roster", title: "Roster & Free Agency", icon: "roster",
      summary: "Who can play, how rosters are built, and when trades close.",
      items: [
        { id: "rf-1", title: "Roster size", body: "Each franchise carries a maximum of 8 players: 5 starters and up to 3 bench players. A team must have at least 6 eligible players at tip-off or it risks forfeiting the game." },
        { id: "rf-2", title: "Trade deadline", body: "All trades must be submitted in #transactions before the Trade Deadline at the end of Week 8. League staff review every trade within 48 hours, and trades that heavily unbalance competitive integrity can be vetoed." },
        { id: "rf-3", title: "Free agency & waivers", body: "Unsigned players enter the free-agent pool and can be claimed through the waiver window, which lasts 48 hours. Teams may make a maximum of 2 roster transactions per week." },
        { id: "rf-4", title: "Ringers, alts & account sharing", body: "Alternate accounts, account sharing, and ringers (players who compete under another person's identity) are banned. Violations result in forfeiture of every game played and a two-season ban for everyone involved." },
        { id: "rf-5", title: "Eligibility", body: "Every player must be in the league Discord and the IPBL Roblox group, and their Discord display name must match their Roblox username. Roster entries are verified by staff before a player's first game." },
      ],
    },
    {
      id: "server", title: "Server Region & Lag / Ping Policy", icon: "server",
      summary: "Coin-flip hosting, ping limits, remakes and disconnect rules.",
      items: [
        { id: "sv-1", title: "Coin-flip server hosting", body: "Before each game, the two captains flip a coin with a referee present. The winner chooses who hosts the private server. The host creates the server in the Singapore region unless both captains agree otherwise." },
        { id: "sv-2", title: "Ping threshold & remakes", body: "If any player's ping stays above 150 ms for 30 consecutive seconds, their captain may request a remake. Before halftime, the game restarts at 0–0. After halftime, the game resumes on a fresh server from the recorded score and clock." },
        { id: "sv-3", title: "Providing ping evidence", body: "Remake requests must include a screenshot or clip of the Roblox Performance Stats overlay showing the player's ping. Requests without evidence are denied by the referee." },
        { id: "sv-4", title: "Disconnect rules", body: "A disconnected player has a 5-minute rejoin window. After 2 minutes, the team plays shorthanded and the game continues. Each player may use a maximum of 2 disconnect windows per game; further disconnects count as that player being unavailable." },
      ],
    },
    {
      id: "conduct", title: "Conduct & Referees", icon: "conduct",
      summary: "Sportsmanship standards, forfeits and the authority of officials.",
      items: [
        { id: "cd-1", title: "Sportsmanship", body: "Respect is non-negotiable. Slurs, harassment, targeted toxicity and discriminatory language are not tolerated. Penalties escalate from a warning to a technical foul, then ejection, then suspension depending on severity." },
        { id: "cd-2", title: "Forfeit timers", body: "Teams have a 10-minute grace period after the scheduled tip-off to field at least 5 players. After that, the game is recorded as a 20–0 forfeit loss. Repeated forfeits can lead to fines or removal from the league." },
        { id: "cd-3", title: "Referee authority", body: "Referee decisions on the court are final. Captains may submit a protest ticket within 24 hours only for a misapplied rule, never for a judgement call. The Head Referee rules on all protests." },
        { id: "cd-4", title: "Voice chat & recording", body: "Both teams must stay in the official Discord voice channel for the game's duration. Referees may request POV clips from any player. Streaming or recording a game without staff permission is not allowed." },
        { id: "cd-5", title: "Exploits & cheating", body: "Any exploit, glitch abuse or third-party tool that provides an unfair advantage will result in immediate disqualification. Players who report a glitch in good faith will not be penalised." },
      ],
    },
  ],
};

/* ============================================================================
 * Derived data & helpers (no need to edit)
 * ========================================================================== */
const SECTION_IDS = ["home", "standings", "schedule", "stats", "rules", "staff"];
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "standings", label: "Standings" },
  { id: "schedule", label: "Schedule" },
  { id: "stats", label: "Stats" },
  { id: "rules", label: "Rulebook" },
  { id: "staff", label: "Staff" },
];
const TEAMS_BY_ID = Object.fromEntries(LEAGUE_CONFIG.teams.map((t) => [t.id, t]));
const POS_COLORS = { PG: "#38bdf8", SG: "#a78bfa", SF: "#34d399", PF: "#fbbf24", C: "#f87171" };
const RULE_ICONS = { gameplay: Gamepad2, roster: UserCheck, server: Wifi, conduct: Gavel };
const DEPT_ICONS = { Commissioners: Crown, Referees: Flag, "Media & GFX": Palette, Streamers: Mic };

const CARD = "bg-[#111115] border border-[#27272a]";
const EYEBROW = "pb-num text-[11px] tracking-[0.22em] uppercase text-zinc-500";

const gamesPlayed = (t) => t.wins + t.losses;
const winPct = (t) => (gamesPlayed(t) ? t.wins / gamesPlayed(t) : 0);
const pointDiff = (t) => t.pointsFor - t.pointsAgainst;
const fmtPct = (p) => (p >= 1 ? "1.000" : p.toFixed(3).slice(1));
const fmtDiff = (d) => (d > 0 ? `+${d}` : `${d}`);
const compareTeams = (a, b) => winPct(b) - winPct(a) || pointDiff(b) - pointDiff(a);

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (rgb) =>
  "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
};
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const alpha = (hex, a) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};
const legible = (hex) => (luminance(hex) < 0.18 ? mix(hex, "#ffffff", 0.4) : hex);

const initialsOf = (name) => {
  const parts = name
    .replace(/[_\d]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/);
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase();
};
const hueOf = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

const parseDate = (d) => new Date(`${d}T00:00:00Z`);
const fmtDate = (d, opts) => parseDate(d).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
const addDays = (d, n) => new Date(parseDate(d).getTime() + n * 86400000).toISOString().slice(0, 10);
const dateLabel = (d, asOf) => {
  const base = fmtDate(d, { weekday: "short", month: "short", day: "numeric" });
  if (d === asOf) return `Today · ${base}`;
  if (d === addDays(asOf, 1)) return `Tomorrow · ${base}`;
  if (d === addDays(asOf, -1)) return `Yesterday · ${base}`;
  return base;
};
const stamp = (g) => `${g.date}T${g.time}`;
const byAsc = (a, b) => stamp(a).localeCompare(stamp(b));
const byDesc = (a, b) => stamp(b).localeCompare(stamp(a));

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

/* ============================================================================
 * Hooks
 * ========================================================================== */
function useModalBehavior(ref, onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    const focusables = () =>
      node
        ? Array.from(
            node.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')
          )
        : [];
    (focusables()[0] || node)?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (prev && prev.focus) prev.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return active;
}

const goTo = (id) => (e) => {
  if (e && e.preventDefault) e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    window.history.replaceState(null, "", `#${id}`);
  } catch (err) {
    /* sandboxed frames may block history changes */
  }
};

/* ============================================================================
 * Global styles
 * ========================================================================== */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      html { scroll-behavior: smooth; }
      .pb-root { font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #f4f4f5; -webkit-font-smoothing: antialiased; }
      .pb-display { font-family: 'Barlow Condensed', 'Roboto Condensed', 'Arial Narrow', Impact, sans-serif; }
      .pb-num { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; }
      .pb-accent-bg { background: var(--accent); color: #09090b; }
      .pb-accent-text { color: var(--accent); }
      .pb-accent2-text { color: var(--accent2); }
      .pb-cut { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
      .pb-grid-bg { background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px); background-size: 48px 48px; }
      .pb-root :focus-visible { outline: 2px solid var(--accent2); outline-offset: 2px; }
      .pb-root ::selection { background: var(--accent); color: #09090b; }
      @keyframes pb-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .pb-marquee { animation: pb-marquee 70s linear infinite; width: max-content; }
      .pb-ticker:hover .pb-marquee { animation-play-state: paused; }
      @keyframes pb-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      .pb-skeleton { background: linear-gradient(90deg, #14141a 25%, #20202a 50%, #14141a 75%); background-size: 200% 100%; animation: pb-shimmer 1.4s infinite; }
      @keyframes pb-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      .pb-fade-up { animation: pb-fade-up .35s ease both; }
      @keyframes pb-pop { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: none; } }
      .pb-pop { animation: pb-pop .25s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes pb-fade { from { opacity: 0; } to { opacity: 1; } }
      .pb-fade { animation: pb-fade .2s ease both; }
      @keyframes pb-slide-in { from { transform: translateX(100%); } to { transform: none; } }
      .pb-slide-in { animation: pb-slide-in .28s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes pb-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(1.6); } }
      .pb-dot { animation: pb-pulse 1.6s ease-in-out infinite; }
      .pb-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
      .pb-scroll::-webkit-scrollbar-thumb { background: #27272a; }
      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .pb-marquee, .pb-dot, .pb-skeleton, .pb-fade-up, .pb-pop, .pb-fade, .pb-slide-in { animation: none !important; }
      }
    `}</style>
  );
}

/* ============================================================================
 * Atoms
 * ========================================================================== */
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="pbLogoG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="url(#pbLogoG)" />
      <g fill="none" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="24" cy="24" r="11" />
        <line x1="24" y1="13" x2="24" y2="35" />
        <line x1="13" y1="24" x2="35" y2="24" />
        <path d="M15.5 15.5 Q24 24 15.5 32.5" strokeWidth="1.8" />
        <path d="M32.5 15.5 Q24 24 32.5 32.5" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/** Square, sharp-cornered esports portrait frame with skeleton + graceful fallback. */
function RobloxAvatar({ userId, username, className = "" }) {
  const [status, setStatus] = useState(userId ? "loading" : "error");

  useEffect(() => {
    if (!userId) {
      setStatus("error");
      return undefined;
    }
    setStatus("loading");
    const t = setTimeout(() => setStatus((s) => (s === "loading" ? "error" : s)), 6000);
    return () => clearTimeout(t);
  }, [userId]);

  const src = userId
    ? `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`
    : "";
  const hue = hueOf(username);

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden bg-[#0d0d11] border border-[#27272a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_0_36px_rgba(56,189,248,0.10)] ${className}`}
    >
      {userId && status !== "error" && (
        <img
          src={src}
          alt={`${username} Roblox avatar`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {status === "loading" && <div className="pb-skeleton absolute inset-0" aria-hidden="true" />}
      {status === "error" && (
        <div
          role="img"
          aria-label={`${username} avatar placeholder`}
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, hsl(${hue} 55% 24%), #0b0b0f 78%)` }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="38" r="16" fill="rgba(255,255,255,0.14)" />
            <path d="M16 100 C16 72 34 62 50 62 C66 62 84 72 84 100 Z" fill="rgba(255,255,255,0.14)" />
          </svg>
          <span className="pb-num absolute bottom-2 left-2 border border-white/10 bg-black/60 px-1.5 py-0.5 text-[11px] font-bold tracking-widest text-white/90">
            {initialsOf(username)}
          </span>
        </div>
      )}
      {/* corner brackets */}
      <span className="pointer-events-none absolute left-1 top-1 h-3 w-3 border-l-2 border-t-2" style={{ borderColor: "var(--accent2)" }} />
      <span className="pointer-events-none absolute right-1 top-1 h-3 w-3 border-r-2 border-t-2" style={{ borderColor: "var(--accent2)" }} />
      <span className="pointer-events-none absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 opacity-60" style={{ borderColor: "var(--accent2)" }} />
      <span className="pointer-events-none absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 opacity-60" style={{ borderColor: "var(--accent2)" }} />
    </div>
  );
}

/** Geometric franchise badge (shield) built from the team colour + abbreviation. */
function TeamBadge({ team, size = 40 }) {
  const clip = "polygon(50% 0%, 100% 16%, 100% 66%, 50% 100%, 0% 66%, 0% 16%)";
  const text = legible(team.primaryColor);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size * 1.08 }} aria-hidden="true">
      <div className="absolute inset-0" style={{ clipPath: clip, background: team.primaryColor }} />
      <div
        className="absolute"
        style={{
          inset: Math.max(2, size * 0.06),
          clipPath: clip,
          background: `linear-gradient(160deg, ${alpha(team.primaryColor, 0.35)}, #0b0b0e 70%)`,
        }}
      />
      <span
        className="pb-display absolute inset-0 flex items-center justify-center font-extrabold tracking-tight"
        style={{ fontSize: size * 0.36, color: text, paddingBottom: size * 0.06 }}
      >
        {team.abbreviation}
      </span>
    </div>
  );
}

function InitialChip({ name, size = 32, color }) {
  const hue = hueOf(name);
  return (
    <span
      className="pb-num inline-flex shrink-0 items-center justify-center border border-white/10 font-bold tracking-wider text-white/90"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: color
          ? `linear-gradient(160deg, ${alpha(color, 0.45)}, #0b0b0f)`
          : `linear-gradient(160deg, hsl(${hue} 50% 26%), #0b0b0f)`,
      }}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  );
}

function Segmented({ options, value, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 border border-[#27272a] bg-[#111115] p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`pb-display px-3 py-1.5 text-sm font-extrabold uppercase tracking-tight transition-colors sm:px-4 sm:text-base ${
              active ? "pb-accent-bg" : "text-zinc-400 hover:bg-[#18181d] hover:text-white"
            }`}
          >
            {o.label}
            {o.count != null && (
              <span className={`pb-num ml-2 text-[11px] ${active ? "opacity-70" : "text-zinc-600"}`}>{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, glow, right }) {
  return (
    <div className="relative mb-8 flex flex-wrap items-end justify-between gap-6">
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-[34rem] max-w-full"
          style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent)" }}
        />
      )}
      <div className="relative">
        <p className={`${EYEBROW} mb-3 flex items-center gap-2`}>
          <span className="inline-block h-px w-6" style={{ background: "var(--accent)" }} />
          {eyebrow}
        </p>
        <h2 className="pb-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">{subtitle}</p>}
      </div>
      {right && <div className="relative">{right}</div>}
    </div>
  );
}

function StreakPill({ streak }) {
  const win = streak[0] === "W";
  return (
    <span
      className={`pb-num inline-block min-w-[2.5rem] px-2 py-0.5 text-center text-xs font-bold ${
        win ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
      }`}
    >
      {streak}
    </span>
  );
}

/* ============================================================================
 * 1. Ticker
 * ========================================================================== */
function Ticker({ games }) {
  const ordered = [
    ...games.filter((g) => g.status === "live"),
    ...games.filter((g) => g.status === "final").sort(byDesc).slice(0, 6),
    ...games.filter((g) => g.status === "upcoming").sort(byAsc).slice(0, 5),
  ];
  const items = ordered.map((g) => {
    const home = TEAMS_BY_ID[g.home];
    const away = TEAMS_BY_ID[g.away];
    const hw = g.status === "final" && g.homeScore > g.awayScore;
    const aw = g.status === "final" && g.awayScore > g.homeScore;
    const tag =
      g.status === "live" ? (
        <span className="flex items-center gap-1.5 font-bold text-red-400">
          <span className="pb-dot inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
          LIVE {g.quarter} {g.clock}
        </span>
      ) : g.status === "final" ? (
        <span className="pb-accent-text font-bold">FINAL</span>
      ) : (
        <span className="pb-accent2-text font-bold">
          {fmtDate(g.date, { weekday: "short" }).toUpperCase()} {g.time} {g.tz}
        </span>
      );
    const side = (t, score, win, dim) => (
      <span className={`flex items-center gap-1.5 ${win ? "text-white" : dim ? "text-zinc-500" : "text-zinc-200"}`}>
        {win && <span className="inline-block h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent" style={{ borderLeftColor: "var(--accent)" }} />}
        <span className={win ? "font-bold" : ""}>{t.abbreviation}</span>
        {score != null && <span className={`pb-num ${win ? "font-bold" : ""}`}>{score}</span>}
      </span>
    );
    return (
      <div key={g.id} className="flex h-9 items-center gap-3 whitespace-nowrap border-r border-[#1c1c21] px-5">
        <span className="pb-num text-[11px] tracking-wider">{tag}</span>
        <span className="pb-num flex items-center gap-2 text-xs">
          {side(away, g.awayScore, aw, g.status === "final" && !aw)}
          <span className="text-zinc-600">{g.status === "upcoming" ? "@" : "–"}</span>
          {side(home, g.homeScore, hw, g.status === "final" && !hw)}
        </span>
      </div>
    );
  });

  return (
    <div className="pb-ticker overflow-hidden border-b border-[#27272a] bg-[#0c0c0f]" role="region" aria-label="League scoreboard ticker">
      <div className="flex">
        <div className="pb-accent-bg pb-display hidden shrink-0 items-center gap-2 px-4 text-sm font-extrabold uppercase tracking-tight sm:flex">
          <Activity size={14} aria-hidden="true" /> Scoreboard
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="pb-marquee flex">
            <div className="flex shrink-0">{items}</div>
            <div className="flex shrink-0" aria-hidden="true">{items}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. Navbar + mobile drawer
 * ========================================================================== */
function MobileDrawer({ active, onClose, cfg }) {
  const ref = useRef(null);
  useModalBehavior(ref, onClose);
  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="pb-fade absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
        className="pb-slide-in absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-l border-[#27272a] bg-[#0c0c0f]"
      >
        <div className="flex items-center justify-between border-b border-[#27272a] p-4">
          <div className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="pb-display text-xl font-extrabold uppercase tracking-tight">{cfg.leagueShortName}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-10 w-10 place-items-center border border-[#27272a] text-zinc-300 hover:bg-[#18181d]">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile">
          <ul className="space-y-1">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    onClose();
                    setTimeout(() => goTo(l.id)(e), 60);
                    e.preventDefault();
                  }}
                  className={`pb-display flex items-center justify-between border-b border-[#1c1c21] px-2 py-3.5 text-3xl font-extrabold uppercase tracking-tight ${
                    active === l.id ? "pb-accent-text" : "text-zinc-200"
                  }`}
                >
                  {l.label}
                  <ChevronRight size={20} className="text-zinc-600" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-[#27272a] p-4">
          <a href={cfg.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="pb-cut pb-display flex items-center justify-center gap-2 bg-white px-5 py-3 text-lg font-extrabold uppercase tracking-tight text-black hover:bg-zinc-200">
            <MessageCircle size={18} aria-hidden="true" /> Join Discord
          </a>
        </div>
      </div>
    </div>
  );
}

function Navbar({ active, cfg }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#27272a] bg-[#09090b]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#home" onClick={goTo("home")} className="flex items-center gap-3" aria-label={`${cfg.leagueName} home`}>
            <Logo />
            <span className="flex flex-col leading-none">
              <span className="pb-display text-xl font-extrabold uppercase tracking-tight">{cfg.leagueShortName}</span>
              <span className="pb-num mt-1 hidden text-[9px] uppercase tracking-[0.2em] text-zinc-500 sm:block">{cfg.seasonLabel}</span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={goTo(l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={`pb-display relative px-3 py-2 text-lg font-extrabold uppercase tracking-tight transition-colors ${
                  active === l.id ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {l.label}
                <span
                  className="absolute inset-x-3 -bottom-px h-0.5 transition-opacity"
                  style={{ background: "var(--accent)", opacity: active === l.id ? 1 : 0 }}
                />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={cfg.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="pb-cut pb-display hidden items-center gap-2 bg-white px-5 py-2 text-base font-extrabold uppercase tracking-tight text-black transition-colors hover:bg-zinc-200 sm:inline-flex">
              <MessageCircle size={16} aria-hidden="true" /> Join Discord
            </a>
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="grid h-10 w-10 place-items-center border border-[#27272a] text-zinc-200 hover:bg-[#18181d] md:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>
      {open && <MobileDrawer active={active} cfg={cfg} onClose={() => setOpen(false)} />}
    </>
  );
}

/* ============================================================================
 * 3. Hero
 * ========================================================================== */
function FeaturedGame({ games }) {
  const g =
    games.find((x) => x.status === "live") ||
    [...games.filter((x) => x.status === "upcoming")].sort(byAsc)[0];
  if (!g) return null;
  const home = TEAMS_BY_ID[g.home];
  const away = TEAMS_BY_ID[g.away];
  const live = g.status === "live";
  const side = (t, score, align) => (
    <div className={`flex flex-1 flex-col items-center gap-2 ${align}`}>
      <TeamBadge team={t} size={64} />
      <div className="text-center">
        <p className="pb-display text-xl font-extrabold uppercase leading-none tracking-tight">{t.name.split(" ").slice(-1)[0]}</p>
        <p className="pb-num mt-1 text-[11px] text-zinc-500">{t.wins}-{t.losses}</p>
      </div>
      {score != null && <p className="pb-num text-4xl font-bold">{score}</p>}
    </div>
  );
  return (
    <div className={`${CARD} relative overflow-hidden p-5`}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
      <div className="mb-5 flex items-center justify-between">
        <p className={EYEBROW}>{live ? "Featured · Live now" : g.featured || "Next tip-off"}</p>
        {live ? (
          <span className="pb-num flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-red-400">
            <span className="pb-dot inline-block h-2 w-2 rounded-full bg-red-500" /> {g.quarter} · {g.clock}
          </span>
        ) : (
          <span className="pb-num text-[11px] tracking-widest text-zinc-400">{g.time} {g.tz}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {side(home, live ? g.homeScore : null, "")}
        <span className="pb-display text-2xl font-extrabold text-zinc-600">VS</span>
        {side(away, live ? g.awayScore : null, "")}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#27272a] pt-4">
        <span className="pb-num flex items-center gap-1.5 text-[11px] text-zinc-500"><MapPin size={12} aria-hidden="true" /> {g.court} · {g.server}</span>
        {g.stream && g.stream.url && g.stream.status !== "none" && (
          <a href={g.stream.url} target="_blank" rel="noopener noreferrer" className="pb-cut pb-accent-bg pb-display inline-flex items-center gap-2 px-4 py-1.5 text-sm font-extrabold uppercase tracking-tight hover:brightness-110">
            <Tv size={14} aria-hidden="true" /> Watch Stream
          </a>
        )}
      </div>
    </div>
  );
}

function Hero({ cfg, onSelectTeam }) {
  const totalGames = cfg.teams.reduce((s, t) => s + gamesPlayed(t), 0) / 2;
  const players = cfg.teams.reduce((s, t) => s + t.roster.length, 0);
  const metrics = [
    { label: "Teams", value: cfg.teams.length, icon: Users },
    { label: "Active Players", value: players, icon: Flame },
    { label: "Prize Pool", value: cfg.prizePool, note: cfg.prizePoolNote, icon: Trophy },
    { label: "Games Played", value: totalGames, icon: Activity },
  ];
  const words = cfg.leagueTagline.split(" ");
  const last = words.pop();
  const power = [...cfg.teams].sort(compareTeams).slice(0, 5);

  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden border-b border-[#27272a]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/2 h-[640px] w-[1100px] max-w-none -translate-x-1/2" style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[520px]" style={{ background: "radial-gradient(closest-side, var(--accent2-glow), transparent)" }} />
      <div
        aria-hidden="true"
        className="pb-grid-bg pointer-events-none absolute inset-0"
        style={{ maskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 20%, transparent 70%)" }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-7">
          <span className="pb-num inline-flex items-center gap-2.5 border border-[#27272a] bg-[#111115]/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
            <span className="pb-dot inline-block h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
            {cfg.seasonLabel} {cfg.seasonPhase} Live
          </span>
          <h1 className="pb-display mt-6 text-[4.25rem] font-extrabold uppercase leading-[0.86] tracking-tight sm:text-8xl lg:text-[9rem]">
            {words.join(" ")}
            <br />
            <span style={{ background: "linear-gradient(90deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {last}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">{cfg.leagueBlurb}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={cfg.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="pb-cut pb-accent-bg pb-display inline-flex items-center gap-2 px-7 py-3 text-xl font-extrabold uppercase tracking-tight transition hover:brightness-110">
              <MessageCircle size={18} aria-hidden="true" /> Join Discord
            </a>
            <a href="#standings" onClick={goTo("standings")} className="pb-cut pb-display inline-flex items-center gap-2 border border-[#3f3f46] bg-[#111115] px-7 py-3 text-xl font-extrabold uppercase tracking-tight text-white transition hover:bg-[#18181d]">
              View Standings <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-2 border border-[#27272a] bg-[#111115]/70 sm:grid-cols-4">
            {metrics.map((m, i) => (
              <div key={m.label} className={`p-4 ${i % 2 === 1 ? "border-l border-[#27272a]" : ""} ${i > 1 ? "border-t border-[#27272a] sm:border-t-0" : ""} ${i > 0 ? "sm:border-l sm:border-[#27272a]" : ""}`}>
                <dt className="pb-num flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  <m.icon size={12} aria-hidden="true" /> {m.label}
                </dt>
                <dd className="pb-num mt-2 text-2xl font-bold sm:text-[1.65rem]">{m.value}</dd>
                {m.note && <p className="mt-1 text-[10px] text-zinc-500">{m.note}</p>}
              </div>
            ))}
          </dl>
        </div>

        <aside className="space-y-4 lg:col-span-5" aria-label="Featured">
          <FeaturedGame games={cfg.schedule} />
          <div className={`${CARD} p-5`}>
            <div className="mb-3 flex items-center justify-between">
              <p className={EYEBROW}>Power rankings</p>
              <Award size={14} className="text-zinc-600" aria-hidden="true" />
            </div>
            <ol className="divide-y divide-[#1c1c21]">
              {power.map((t, i) => (
                <li key={t.id}>
                  <button type="button" onClick={() => onSelectTeam(t.id)} className="group flex w-full items-center gap-3 py-2.5 text-left hover:bg-[#18181d]">
                    <span className="pb-num w-5 text-xs text-zinc-500">{i + 1}</span>
                    <TeamBadge team={t} size={28} />
                    <span className="pb-display flex-1 text-xl font-extrabold uppercase tracking-tight">{t.name}</span>
                    <span className="pb-num text-xs text-zinc-400">{t.wins}-{t.losses}</span>
                    <StreakPill streak={t.streak} />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ============================================================================
 * 4. Standings + Team modal
 * ========================================================================== */
function TeamModal({ team, leagueRank, confRank, onClose }) {
  const ref = useRef(null);
  useModalBehavior(ref, onClose);
  const gp = gamesPlayed(team);
  const starters = team.roster.filter((p) => !["Sixth Man", "Bench"].includes(p.role));
  const bench = team.roster.filter((p) => ["Sixth Man", "Bench"].includes(p.role));
  const stats = [
    { l: "Record", v: `${team.wins}–${team.losses}` },
    { l: "Win %", v: fmtPct(winPct(team)) },
    { l: "PPG", v: (team.pointsFor / gp).toFixed(1) },
    { l: "Opp PPG", v: (team.pointsAgainst / gp).toFixed(1) },
    { l: "Diff", v: fmtDiff(pointDiff(team)), tone: pointDiff(team) >= 0 ? "text-emerald-400" : "text-red-400" },
    { l: "Streak", v: team.streak, tone: team.streak[0] === "W" ? "text-emerald-400" : "text-red-400" },
  ];
  const row = (p) => (
    <li key={p.username} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#18181d]">
      <span className="pb-num w-7 text-right text-sm text-zinc-500">#{p.number}</span>
      <InitialChip name={p.username} size={30} color={team.primaryColor} />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.username}</span>
      <span className="pb-num px-2 py-0.5 text-[11px] font-bold" style={{ color: POS_COLORS[p.position], background: alpha(POS_COLORS[p.position], 0.12) }}>
        {p.position}
      </span>
      <span className="hidden w-20 text-right text-xs text-zinc-500 sm:block">{p.role}</span>
    </li>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div className="pb-fade absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-modal-title"
        tabIndex={-1}
        className="pb-pop relative max-h-[92vh] w-full overflow-y-auto border border-[#27272a] bg-[#111115] shadow-2xl sm:max-w-3xl"
      >
        <div className="relative h-32 overflow-hidden sm:h-40" style={{ background: `linear-gradient(135deg, ${team.primaryColor}, ${mix(team.primaryColor, "#000000", 0.7)})` }}>
          <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: "repeating-linear-gradient(115deg, rgba(0,0,0,.35) 0 2px, transparent 2px 18px)" }} />
          <span aria-hidden="true" className="pb-display absolute -bottom-6 right-4 select-none text-[9rem] font-extrabold leading-none text-black/20 sm:text-[12rem]">
            {team.abbreviation}
          </span>
          <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(to top, #111115, transparent)" }} />
          <button type="button" onClick={onClose} aria-label="Close team details" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center border border-white/20 bg-black/50 text-white backdrop-blur hover:bg-black/70">
            <X size={18} />
          </button>
        </div>

        <div className="-mt-12 px-5 pb-6 sm:px-8">
          <div className="relative flex items-end gap-4">
            <TeamBadge team={team} size={84} />
            <div className="pb-1">
              <h3 id="team-modal-title" className="pb-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl">{team.name}</h3>
              <p className="pb-num mt-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                {team.conference} Conference · #{confRank} in conf · #{leagueRank} overall
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 border border-[#27272a] sm:grid-cols-6">
            {stats.map((s, i) => (
              <div key={s.l} className={`p-3 ${i % 3 !== 0 ? "border-l border-[#27272a]" : ""} ${i > 2 ? "border-t border-[#27272a] sm:border-t-0" : ""} ${i > 0 ? "sm:border-l sm:border-[#27272a]" : ""}`}>
                <dt className="pb-num text-[10px] uppercase tracking-[0.16em] text-zinc-500">{s.l}</dt>
                <dd className={`pb-num mt-1 text-xl font-bold ${s.tone || ""}`}>{s.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex items-center gap-3 border border-[#27272a] bg-[#0d0d11] p-3">
            <InitialChip name={team.gm} size={36} />
            <div className="min-w-0">
              <p className="pb-num text-[10px] uppercase tracking-[0.18em] text-zinc-500">General Manager</p>
              <p className="truncate text-sm font-semibold">{team.gm}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="pb-display text-2xl font-extrabold uppercase tracking-tight">Starting Five</h4>
              <span className="pb-num text-[11px] text-zinc-500">{team.roster.length} on roster</span>
            </div>
            <ul className="divide-y divide-[#1c1c21] border border-[#27272a]">{starters.map(row)}</ul>
            {bench.length > 0 && (
              <>
                <h4 className="pb-display mb-2 mt-5 text-2xl font-extrabold uppercase tracking-tight">Bench</h4>
                <ul className="divide-y divide-[#1c1c21] border border-[#27272a]">{bench.map(row)}</ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Standings({ cfg, onSelectTeam }) {
  const [conf, setConf] = useState("all");
  const [sort, setSort] = useState({ key: "rank", dir: "asc" });

  const { leagueRank, confRank } = useMemo(() => {
    const order = [...cfg.teams].sort(compareTeams);
    const lr = {};
    const cr = {};
    order.forEach((t, i) => (lr[t.id] = i + 1));
    ["Eastern", "Western"].forEach((c) =>
      order.filter((t) => t.conference === c).forEach((t, i) => (cr[t.id] = i + 1))
    );
    return { leagueRank: lr, confRank: cr };
  }, [cfg.teams]);

  const rows = useMemo(() => {
    const filtered = cfg.teams.filter((t) => conf === "all" || t.conference === conf);
    const withRank = filtered.map((t) => ({ ...t, rank: conf === "all" ? leagueRank[t.id] : confRank[t.id] }));
    const val = {
      rank: (r) => r.rank,
      team: (r) => r.name,
      w: (r) => r.wins,
      l: (r) => r.losses,
      pct: (r) => winPct(r),
      diff: (r) => pointDiff(r),
      streak: (r) => (r.streak[0] === "W" ? 1 : -1) * Number(r.streak.slice(1)),
    }[sort.key];
    return withRank.sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      const c = typeof va === "string" ? va.localeCompare(vb) : va - vb;
      return sort.dir === "asc" ? c : -c;
    });
  }, [cfg.teams, conf, sort, leagueRank, confRank]);

  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: ["rank", "team", "l"].includes(key) ? "asc" : "desc" }
    );

  // Plain render helper (not a component) so sort buttons keep focus across re-renders.
  const th = (k, label, className = "") => {
    const on = sort.key === k;
    return (
      <th key={k} scope="col" aria-sort={on ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={`px-3 py-3 font-semibold ${className}`}>
        <button type="button" onClick={() => toggleSort(k)} className={`inline-flex items-center gap-1 uppercase tracking-[0.14em] hover:text-white ${on ? "text-white" : ""}`}>
          {label}
          {on ? (sort.dir === "asc" ? <ArrowUp size={11} aria-hidden="true" /> : <ArrowDown size={11} aria-hidden="true" />) : <ArrowUpDown size={11} className="opacity-40" aria-hidden="true" />}
        </button>
      </th>
    );
  };

  return (
    <section id="standings" className="scroll-mt-20 border-b border-[#27272a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeader
          eyebrow={`${cfg.seasonLabel} · League standings`}
          title="Standings"
          subtitle="Click any franchise to open its roster, season numbers and front office."
          right={
            <Segmented
              label="Conference filter"
              value={conf}
              onChange={setConf}
              options={[
                { value: "all", label: "All League" },
                { value: "Eastern", label: "Eastern Conference" },
                { value: "Western", label: "Western Conference" },
              ]}
            />
          }
        />
        <div key={conf} className={`${CARD} pb-fade-up overflow-x-auto pb-scroll`}>
          <table className="w-full min-w-[520px] text-sm">
            <caption className="sr-only">League standings</caption>
            <thead>
              <tr className="pb-num border-b border-[#27272a] bg-[#0d0d11] text-left text-[10px] text-zinc-500">
                {th("rank", "Rank", "w-16")}
                {th("team", "Team")}
                {th("w", "W", "text-right")}
                {th("l", "L", "text-right")}
                {th("pct", "PCT", "text-right")}
                {th("diff", "DIFF", "text-right")}
                {th("streak", "STREAK", "text-center")}
                <th className="w-8" aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const d = pointDiff(t);
                const playoff = confRank[t.id] <= 3;
                return (
                  <tr key={t.id} onClick={() => onSelectTeam(t.id)} className="group cursor-pointer border-b border-[#1c1c21] transition-colors last:border-b-0 hover:bg-[#18181d]">
                    <td className="px-3 py-3" style={{ boxShadow: playoff ? "inset 3px 0 0 var(--accent)" : "none" }}>
                      <span className="pb-num pl-1 text-zinc-400">{t.rank}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button type="button" aria-label={`Open ${t.name} details`} className="flex items-center gap-3 text-left">
                        <TeamBadge team={t} size={34} />
                        <span className="flex flex-col leading-tight">
                          <span className="pb-display hidden text-xl font-extrabold uppercase tracking-tight sm:block">{t.name}</span>
                          <span className="pb-display text-xl font-extrabold uppercase tracking-tight sm:hidden">{t.abbreviation}</span>
                          {conf === "all" && <span className="pb-num hidden text-[10px] uppercase tracking-widest text-zinc-500 md:block">{t.conference}</span>}
                        </span>
                      </button>
                    </td>
                    <td className="pb-num px-3 py-3 text-right font-semibold">{t.wins}</td>
                    <td className="pb-num px-3 py-3 text-right text-zinc-400">{t.losses}</td>
                    <td className="pb-num px-3 py-3 text-right">{fmtPct(winPct(t))}</td>
                    <td className={`pb-num px-3 py-3 text-right font-semibold ${d >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmtDiff(d)}</td>
                    <td className="px-3 py-3 text-center"><StreakPill streak={t.streak} /></td>
                    <td className="pr-3 text-zinc-600 transition-colors group-hover:text-white"><ChevronRight size={16} aria-hidden="true" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="pb-num mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="inline-block h-3 w-[3px]" style={{ background: "var(--accent)" }} />
          Top 3 in each conference hold a playoff position. Ranks tiebreak on point differential.
        </p>
      </div>
    </section>
  );
}

/* ============================================================================
 * 5. Schedule
 * ========================================================================== */
function StreamBadge({ game }) {
  const s = game.stream || { status: "none" };
  if (s.status === "live")
    return (
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="pb-accent-bg pb-display inline-flex items-center gap-2 px-3 py-1.5 text-sm font-extrabold uppercase tracking-tight hover:brightness-110">
        <span className="pb-dot inline-block h-1.5 w-1.5 rounded-full bg-black" /> Watch Stream
      </a>
    );
  if (s.status === "scheduled")
    return (
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="pb-display inline-flex items-center gap-2 border border-[#3f3f46] px-3 py-1.5 text-sm font-extrabold uppercase tracking-tight text-zinc-200 hover:bg-[#18181d]">
        <Tv size={14} aria-hidden="true" /> Watch Stream
        <span className="pb-num hidden text-[10px] font-normal normal-case tracking-normal text-zinc-500 sm:inline">· {s.channel}</span>
      </a>
    );
  if (s.status === "vod")
    return (
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="pb-display inline-flex items-center gap-2 px-1 py-1.5 text-sm font-extrabold uppercase tracking-tight text-zinc-400 hover:text-white">
        <Tv size={14} aria-hidden="true" /> Replay
      </a>
    );
  return <span className="pb-num inline-flex items-center gap-2 px-1 py-1.5 text-[11px] uppercase tracking-widest text-zinc-600">No stream</span>;
}

function GameCard({ game }) {
  const [open, setOpen] = useState(false);
  const home = TEAMS_BY_ID[game.home];
  const away = TEAMS_BY_ID[game.away];
  const final = game.status === "final";
  const live = game.status === "live";
  const hw = final && game.homeScore > game.awayScore;
  const aw = final && game.awayScore > game.homeScore;
  const teamBlock = (t, label, align, win, lose) => (
    <div className={`flex min-w-0 flex-1 items-center gap-3 ${align === "right" ? "flex-row-reverse text-right" : ""} ${lose ? "opacity-60" : ""}`}>
      <TeamBadge team={t} size={48} />
      <div className="min-w-0">
        <p className="pb-num text-[9px] uppercase tracking-[0.2em] text-zinc-600">{label}</p>
        <p className={`pb-display truncate text-2xl font-extrabold uppercase leading-none tracking-tight ${win ? "text-white" : ""}`}>
          <span className="hidden sm:inline">{t.name}</span>
          <span className="sm:hidden">{t.abbreviation}</span>
        </p>
        <p className="pb-num mt-1 text-[11px] text-zinc-500">{t.wins}-{t.losses}</p>
      </div>
    </div>
  );
  const score = (n, win) => (
    <span className={`pb-num text-3xl font-bold ${win ? "text-white" : "text-zinc-500"}`} style={win ? { textShadow: "0 0 24px var(--accent-glow)" } : undefined}>
      {n}
    </span>
  );

  return (
    <article className={`${CARD} pb-fade-up flex flex-col transition-colors hover:bg-[#14141a]`}>
      <div className="flex items-center justify-between gap-3 border-b border-[#1c1c21] px-4 py-2.5">
        <p className="pb-num flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-400">
          <Calendar size={12} aria-hidden="true" />
          {fmtDate(game.date, { weekday: "short", month: "short", day: "numeric" })}
          <span className="text-zinc-700">·</span>
          <Clock size={12} aria-hidden="true" /> {game.time} {game.tz}
        </p>
        {live ? (
          <span className="pb-num flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 text-[11px] font-bold tracking-widest text-red-400">
            <span className="pb-dot inline-block h-1.5 w-1.5 rounded-full bg-red-500" /> LIVE · {game.quarter} {game.clock}
          </span>
        ) : final ? (
          <span className="pb-num bg-white/5 px-2 py-0.5 text-[11px] font-bold tracking-widest text-zinc-300">FINAL</span>
        ) : game.featured ? (
          <span className="pb-num px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>{game.featured}</span>
        ) : (
          <span className="pb-num text-[11px] uppercase tracking-widest text-zinc-600">Upcoming</span>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-5">
        {teamBlock(home, "Home", "left", hw, aw)}
        <div className="flex shrink-0 items-center gap-2">
          {final || live ? (
            <>
              {score(game.homeScore, hw || (live && game.homeScore > game.awayScore))}
              <span className="text-zinc-700">–</span>
              {score(game.awayScore, aw || (live && game.awayScore > game.homeScore))}
            </>
          ) : (
            <span className="pb-display text-2xl font-extrabold text-zinc-600">VS</span>
          )}
        </div>
        {teamBlock(away, "Away", "right", aw, hw)}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#1c1c21] px-4 py-2.5 text-[11px] text-zinc-500">
        <span className="pb-num flex items-center gap-1.5"><MapPin size={12} aria-hidden="true" /> {game.court}</span>
        <span className="pb-num flex items-center gap-1.5"><Server size={12} aria-hidden="true" /> {game.server} server · coin-flip host</span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#1c1c21] px-3 py-2">
        <StreamBadge game={game} />
        {final && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={`box-${game.id}`}
            className="pb-display inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-extrabold uppercase tracking-tight text-zinc-300 hover:text-white"
          >
            Box Score <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        )}
      </div>

      {final && (
        <div id={`box-${game.id}`} className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="border-t border-[#1c1c21] bg-[#0d0d11] p-4">
              <table className="pb-num w-full text-xs">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-zinc-600">
                    <th className="py-1 font-medium">Team</th>
                    {["Q1", "Q2", "Q3", "Q4"].map((q) => <th key={q} className="py-1 text-right font-medium">{q}</th>)}
                    <th className="py-1 text-right font-medium text-zinc-400">T</th>
                  </tr>
                </thead>
                <tbody>
                  {[[home, game.homeQ, game.homeScore, hw], [away, game.awayQ, game.awayScore, aw]].map(([t, q, total, win]) => (
                    <tr key={t.id} className="border-t border-[#1c1c21]">
                      <td className={`py-1.5 font-bold ${win ? "text-white" : "text-zinc-400"}`}>{t.abbreviation}</td>
                      {q.map((v, i) => <td key={i} className="py-1.5 text-right text-zinc-400">{v}</td>)}
                      <td className={`py-1.5 text-right font-bold ${win ? "text-white" : "text-zinc-400"}`}>{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 flex items-center gap-3 border border-[#27272a] bg-[#111115] p-2.5">
                <InitialChip name={game.mvp} size={32} />
                <div className="min-w-0">
                  <p className="pb-num text-[9px] uppercase tracking-[0.2em] pb-accent-text">Game MVP</p>
                  <p className="truncate text-sm font-semibold">{game.mvp}</p>
                </div>
                <p className="pb-num ml-auto text-right text-[11px] text-zinc-400">{game.mvpLine}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function Schedule({ cfg }) {
  const [tab, setTab] = useState("upcoming");
  const upcoming = useMemo(() => cfg.schedule.filter((g) => g.status !== "final").sort(byAsc), [cfg.schedule]);
  const completed = useMemo(() => cfg.schedule.filter((g) => g.status === "final").sort(byDesc), [cfg.schedule]);
  const list = tab === "upcoming" ? upcoming : completed;
  const groups = useMemo(() => {
    const map = new Map();
    list.forEach((g) => map.set(g.date, [...(map.get(g.date) || []), g]));
    return [...map.entries()];
  }, [list]);

  return (
    <section id="schedule" className="scroll-mt-20 border-b border-[#27272a] bg-[#0b0b0e]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeader
          eyebrow="Tip-offs & final scores"
          title="Schedule & Results"
          subtitle="All times shown in WIB (UTC+7). Games are played on private servers in the Singapore region."
          right={
            <Segmented
              label="Schedule filter"
              value={tab}
              onChange={setTab}
              options={[
                { value: "upcoming", label: "Upcoming Games", count: upcoming.length },
                { value: "completed", label: "Completed Results", count: completed.length },
              ]}
            />
          }
        />
        <div key={tab} className="space-y-8">
          {groups.map(([date, games]) => (
            <div key={date}>
              <h3 className="pb-num mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                <span className="inline-block h-px w-5" style={{ background: "var(--accent2)" }} />
                {dateLabel(date, cfg.asOfDate)}
              </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {games.map((g) => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * 6. Stat leaders
 * ========================================================================== */
function StatLeaders({ cfg, onSelectTeam }) {
  const [cat, setCat] = useState(cfg.statCategories[0].key);
  const meta = cfg.statCategories.find((c) => c.key === cat);
  const rows = cfg.statLeaders[cat] || [];
  const [first, ...rest] = rows;
  const fmt = (v) => `${v.toFixed(meta.decimals)}${meta.suffix || ""}`;
  const firstTeam = first ? TEAMS_BY_ID[first.teamId] : null;

  return (
    <section id="stats" className="scroll-mt-20 border-b border-[#27272a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeader eyebrow={`${cfg.seasonLabel} · Individual leaders`} title="Statistical Leaders" subtitle="Per-game averages across the regular season." />
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Stat category">
          {cfg.statCategories.map((c) => {
            const on = c.key === cat;
            return (
              <button
                key={c.key}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c.key)}
                className={`pb-cut pb-num px-4 py-2 text-sm font-bold transition-colors ${on ? "pb-accent-bg" : "border border-[#27272a] bg-[#111115] text-zinc-400 hover:bg-[#18181d] hover:text-white"}`}
              >
                {c.key}
              </button>
            );
          })}
        </div>

        {first && (
          <div key={cat} className="pb-fade-up grid gap-4 lg:grid-cols-12">
            <div className={`${CARD} relative overflow-hidden p-5 lg:col-span-5`}>
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64" style={{ background: `radial-gradient(closest-side, ${alpha(firstTeam.primaryColor, 0.28)}, transparent)` }} />
              <p className="pb-num relative mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] pb-accent-text">
                <Target size={13} aria-hidden="true" /> #1 League Leader · {meta.full}
              </p>
              <div className="relative flex gap-4">
                <div className="w-32 shrink-0 sm:w-36">
                  <RobloxAvatar userId={first.robloxUserId} username={first.username} />
                </div>
                <div className="min-w-0 self-end">
                  <h3 className="pb-display break-words text-3xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-4xl">{first.username}</h3>
                  <button type="button" onClick={() => onSelectTeam(firstTeam.id)} className="mt-3 inline-flex items-center gap-2 text-left hover:opacity-80">
                    <TeamBadge team={firstTeam} size={26} />
                    <span className="text-sm text-zinc-300">{firstTeam.name}</span>
                  </button>
                </div>
              </div>
              <div className="relative mt-6 flex items-end justify-between border-t border-[#27272a] pt-4">
                <div>
                  <p className="pb-num text-6xl font-bold leading-none sm:text-7xl" style={{ textShadow: "0 0 40px var(--accent-glow)" }}>{fmt(first.value)}</p>
                  <p className="pb-display mt-2 text-lg font-extrabold uppercase tracking-tight text-zinc-400">{meta.key}</p>
                </div>
                <div className="text-right">
                  <p className="pb-num text-[10px] uppercase tracking-[0.2em] text-zinc-500">GP</p>
                  <p className="pb-num text-2xl font-bold">{first.gp}</p>
                </div>
              </div>
            </div>

            <div className={`${CARD} lg:col-span-7`}>
              <div className="pb-num flex items-center border-b border-[#27272a] bg-[#0d0d11] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <span className="w-8">#</span>
                <span className="flex-1">Player</span>
                <span className="w-10 text-right">GP</span>
                <span className="w-20 text-right">{meta.key}</span>
              </div>
              <ol>
                {rest.map((r, i) => {
                  const t = TEAMS_BY_ID[r.teamId];
                  const pct = Math.max(8, (r.value / first.value) * 100);
                  return (
                    <li key={`${r.username}-${i}`} className="border-b border-[#1c1c21] last:border-b-0">
                      <button type="button" onClick={() => onSelectTeam(t.id)} className="group relative flex w-full items-center px-4 py-3.5 text-left hover:bg-[#18181d]">
                        <span className="pb-num w-8 text-sm text-zinc-500">{i + 2}</span>
                        <span className="flex min-w-0 flex-1 items-center gap-3">
                          <InitialChip name={r.username} size={34} color={t.primaryColor} />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{r.username}</span>
                            <span className="mt-0.5 flex items-center gap-2">
                              <TeamBadge team={t} size={16} />
                              <span className="pb-num text-[11px] text-zinc-500">{t.abbreviation}</span>
                            </span>
                          </span>
                        </span>
                        <span className="pb-num w-10 text-right text-sm text-zinc-400">{r.gp}</span>
                        <span className="pb-num w-20 text-right text-lg font-bold">{fmt(r.value)}</span>
                        <span aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${t.primaryColor}, transparent)` }} />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================================
 * 7. Rulebook
 * ========================================================================== */
function Highlight({ text, query }) {
  const q = query.trim();
  if (!q) return text;
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="bg-transparent pb-accent-text underline decoration-[var(--accent)] decoration-2 underline-offset-2">{p}</mark>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
}

function Rulebook({ cfg }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [openIds, setOpenIds] = useState(() => new Set([cfg.rules[0]?.items[0]?.id]));
  const q = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      cfg.rules
        .map((c, ci) => ({
          ...c,
          ci,
          items: c.items
            .map((it, ii) => ({ ...it, ii }))
            .filter((it) => (cat === "all" || cat === c.id) && (!q || `${it.title} ${it.body}`.toLowerCase().includes(q))),
        }))
        .filter((c) => c.items.length),
    [cfg.rules, cat, q]
  );
  const total = visible.reduce((s, c) => s + c.items.length, 0);

  useEffect(() => {
    if (q) setOpenIds(new Set(visible.flatMap((c) => c.items.map((i) => i.id))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, cat]);

  const toggle = (id) =>
    setOpenIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <section id="rules" className="scroll-mt-20 border-b border-[#27272a] bg-[#0b0b0e]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeader eyebrow="Official league rules" title="Practical Basketball Rulebook" subtitle="Everything captains, players and officials need to know. Search or browse by category." />
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <label className="relative block">
              <span className="sr-only">Search the rulebook</span>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rules… e.g. ping, forfeit"
                className="w-full border border-[#27272a] bg-[#111115] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--accent2)] focus:outline-none"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-scroll lg:flex-col lg:overflow-visible" role="group" aria-label="Rule category">
              {[{ id: "all", title: "All Rules", icon: null }, ...cfg.rules].map((c) => {
                const on = cat === c.id;
                const Icon = c.icon ? RULE_ICONS[c.icon] : BookOpen;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCat(c.id)}
                    className={`flex shrink-0 items-center gap-3 border px-3 py-2.5 text-left transition-colors lg:w-full ${on ? "border-[var(--accent)] bg-[#18181d] text-white" : "border-[#27272a] bg-[#111115] text-zinc-400 hover:bg-[#18181d] hover:text-white"}`}
                  >
                    <Icon size={16} className={on ? "pb-accent-text" : ""} aria-hidden="true" />
                    <span className="pb-display whitespace-nowrap text-lg font-extrabold uppercase leading-none tracking-tight lg:whitespace-normal">{c.title}</span>
                  </button>
                );
              })}
            </div>
            <div className="hidden items-center justify-between lg:flex">
              <span className="pb-num text-[11px] text-zinc-500">{total} rule{total === 1 ? "" : "s"}</span>
              <span className="flex gap-3 text-[11px]">
                <button type="button" className="text-zinc-400 underline-offset-2 hover:text-white hover:underline" onClick={() => setOpenIds(new Set(visible.flatMap((c) => c.items.map((i) => i.id))))}>Expand all</button>
                <button type="button" className="text-zinc-400 underline-offset-2 hover:text-white hover:underline" onClick={() => setOpenIds(new Set())}>Collapse all</button>
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {visible.length === 0 && (
              <div className={`${CARD} p-10 text-center`}>
                <p className="pb-display text-3xl font-extrabold uppercase tracking-tight">No rules found</p>
                <p className="mt-2 text-sm text-zinc-400">Nothing matches “{query}”. Try a different keyword.</p>
                <button type="button" onClick={() => { setQuery(""); setCat("all"); }} className="pb-cut pb-accent-bg pb-display mt-5 px-5 py-2 text-base font-extrabold uppercase tracking-tight">Clear search</button>
              </div>
            )}
            {visible.map((c) => {
              const Icon = RULE_ICONS[c.icon] || Gavel;
              return (
                <div key={c.id}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center border border-[#27272a] bg-[#111115]"><Icon size={16} className="pb-accent-text" aria-hidden="true" /></span>
                    <div>
                      <h3 className="pb-display text-2xl font-extrabold uppercase leading-none tracking-tight">{c.title}</h3>
                      <p className="mt-1 text-xs text-zinc-500">{c.summary}</p>
                    </div>
                  </div>
                  <ul className={`${CARD} divide-y divide-[#1c1c21]`}>
                    {c.items.map((it) => {
                      const isOpen = openIds.has(it.id);
                      return (
                        <li key={it.id}>
                          <h4>
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              aria-controls={`panel-${it.id}`}
                              id={`btn-${it.id}`}
                              onClick={() => toggle(it.id)}
                              className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-[#18181d]"
                            >
                              <span className="pb-num w-10 shrink-0 text-xs text-zinc-600">§{c.ci + 1}.{it.ii + 1}</span>
                              <span className="flex-1 text-[15px] font-semibold"><Highlight text={it.title} query={query} /></span>
                              <ChevronDown size={16} className={`shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180 text-white" : ""}`} aria-hidden="true" />
                            </button>
                          </h4>
                          <div id={`panel-${it.id}`} role="region" aria-labelledby={`btn-${it.id}`} className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="overflow-hidden">
                              <p className="pb-4 pl-[4.5rem] pr-6 text-sm leading-relaxed text-zinc-400">
                                <Highlight text={it.body} query={query} />
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * 8. Staff
 * ========================================================================== */
function StaffCard({ s, color, onCopy }) {
  const [copied, setCopied] = useState(false);
  const Icon = DEPT_ICONS[s.department] || Crown;
  const handle = `@${s.discordTag}`;
  const copy = async () => {
    const ok = await copyText(handle);
    if (ok) {
      setCopied(true);
      onCopy(`Copied ${handle}`);
      setTimeout(() => setCopied(false), 1800);
    } else {
      onCopy("Couldn't copy. Select the handle manually.");
    }
  };
  return (
    <article className="group relative flex flex-col border border-[#27272a] bg-[#111115] transition-colors duration-200 hover:bg-[#18181d]" style={{ ["--c"]: color }}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: color }} />
      <div className="p-3 pb-0">
        <RobloxAvatar userId={s.robloxUserId} username={s.robloxUsername} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="pb-num inline-flex w-fit items-center gap-1.5 border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color, borderColor: alpha(color, 0.35), background: alpha(color, 0.1) }}>
          <Icon size={11} aria-hidden="true" /> {s.role}
        </span>
        <h3 className="pb-display mt-3 break-words text-[1.7rem] font-extrabold uppercase leading-[0.95] tracking-tight">{s.robloxUsername}</h3>
        <p className="mt-1 text-xs text-zinc-500">{s.displayName} · {s.department}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-[13px] leading-relaxed text-zinc-400">{s.bio}</p>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy Discord handle ${handle}`}
            className="flex w-full items-center justify-between gap-2 border border-[#27272a] bg-[#0d0d11] px-3 py-2 text-left transition-colors hover:border-[#3f3f46]"
          >
            <span className="pb-num truncate text-xs text-zinc-300">{copied ? "Copied!" : handle}</span>
            {copied ? <Check size={14} className="shrink-0 text-emerald-400" aria-hidden="true" /> : <Copy size={14} className="shrink-0 text-zinc-500 group-hover:text-white" aria-hidden="true" />}
          </button>
          <span className="pb-num inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            <Globe size={11} aria-hidden="true" /> {s.region}
          </span>
        </div>
      </div>
    </article>
  );
}

function Staff({ cfg, onCopy }) {
  const [dept, setDept] = useState("all");
  const depts = Object.keys(cfg.departmentColors);
  const list = cfg.staff.filter((s) => dept === "all" || s.department === dept);
  return (
    <section id="staff" className="relative scroll-mt-20 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeader
          glow
          eyebrow="The people behind the league"
          title="Staff & Leadership"
          subtitle="Commissioners, officials, designers and broadcasters who keep every game night running. Tap a handle to copy their Discord."
        />
        <div className="mb-8">
          <Segmented
            label="Staff department filter"
            value={dept}
            onChange={setDept}
            options={[
              { value: "all", label: "All Staff", count: cfg.staff.length },
              ...depts.map((d) => ({ value: d, label: d, count: cfg.staff.filter((s) => s.department === d).length })),
            ]}
          />
        </div>
        <div key={dept} className="pb-fade-up grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((s) => (
            <StaffCard key={s.id} s={s} color={cfg.departmentColors[s.department] || "#f97316"} onCopy={onCopy} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * 9. Footer + Toast
 * ========================================================================== */
function Footer({ cfg }) {
  return (
    <footer className="border-t border-[#27272a] bg-[#0b0b0e]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <div>
                <p className="pb-display text-2xl font-extrabold uppercase leading-none tracking-tight">{cfg.leagueName}</p>
                <p className="pb-num mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{cfg.seasonLabel} · {cfg.leagueTagline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-zinc-500">Competitive Practical Basketball, built by the community in Indonesia.</p>
          </div>
          <nav className="md:col-span-3" aria-label="Footer">
            <p className={`${EYEBROW} mb-3`}>Navigate</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={goTo(l.id)} className="text-sm text-zinc-400 hover:text-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className={`${EYEBROW} mb-3`}>Community</p>
            <div className="flex flex-wrap gap-2">
              <a href={cfg.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="pb-display inline-flex items-center gap-2 border border-[#27272a] bg-[#111115] px-4 py-2 text-base font-extrabold uppercase tracking-tight hover:bg-[#18181d]">
                <MessageCircle size={15} aria-hidden="true" /> Discord <ExternalLink size={12} className="text-zinc-500" aria-hidden="true" />
              </a>
              <a href={cfg.robloxGroupUrl} target="_blank" rel="noopener noreferrer" className="pb-display inline-flex items-center gap-2 border border-[#27272a] bg-[#111115] px-4 py-2 text-base font-extrabold uppercase tracking-tight hover:bg-[#18181d]">
                <Users size={15} aria-hidden="true" /> Roblox Group <ExternalLink size={12} className="text-zinc-500" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#1c1c21] pt-6">
          <p className="max-w-2xl text-xs leading-relaxed text-zinc-600">
            Not affiliated with Roblox Corporation or Practical Basketball. All trademarks and game assets belong to their respective owners.
          </p>
          <a href="#home" onClick={goTo("home")} className="pb-num inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500 hover:text-white">
            Back to top <ArrowUp size={12} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function Toast({ toast }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="pb-pop pb-cut flex items-center gap-2.5 border border-[#3f3f46] bg-[#18181d] px-4 py-2.5 text-sm shadow-2xl">
          <Check size={15} className="text-emerald-400" aria-hidden="true" />
          <span className="pb-num text-xs">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * App
 * ========================================================================== */
export default function PracticalBasketballLeagueHub() {
  const cfg = LEAGUE_CONFIG;
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [toast, setToast] = useState(null);
  const active = useActiveSection(SECTION_IDS);

  const notify = useCallback((message) => setToast({ message, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const ranks = useMemo(() => {
    const order = [...cfg.teams].sort(compareTeams);
    const league = {};
    const conf = {};
    order.forEach((t, i) => (league[t.id] = i + 1));
    ["Eastern", "Western"].forEach((c) => order.filter((t) => t.conference === c).forEach((t, i) => (conf[t.id] = i + 1)));
    return { league, conf };
  }, [cfg.teams]);

  const selectedTeam = selectedTeamId ? TEAMS_BY_ID[selectedTeamId] : null;

  return (
    <div
      className="pb-root min-h-screen overflow-x-clip bg-[#09090b] text-zinc-100"
      style={{
        "--accent": cfg.accentColor,
        "--accent2": cfg.secondaryAccent,
        "--accent-glow": alpha(cfg.accentColor, 0.2),
        "--accent2-glow": alpha(cfg.secondaryAccent, 0.12),
      }}
    >
      <GlobalStyle />
      <a href="#standings" onClick={goTo("standings")} className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[90] focus:bg-white focus:px-3 focus:py-2 focus:text-black">
        Skip to standings
      </a>
      <Ticker games={cfg.schedule} />
      <Navbar active={active} cfg={cfg} />
      <main>
        <Hero cfg={cfg} onSelectTeam={setSelectedTeamId} />
        <Standings cfg={cfg} onSelectTeam={setSelectedTeamId} />
        <Schedule cfg={cfg} />
        <StatLeaders cfg={cfg} onSelectTeam={setSelectedTeamId} />
        <Rulebook cfg={cfg} />
        <Staff cfg={cfg} onCopy={notify} />
      </main>
      <Footer cfg={cfg} />
      {selectedTeam && (
        <TeamModal
          team={selectedTeam}
          leagueRank={ranks.league[selectedTeam.id]}
          confRank={ranks.conf[selectedTeam.id]}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}
