interface Verb {
    name: string
    popularity: number
    categories: string[]
    color: string
  }
  
  const verbData: Verb[] = [
    // Support & Assistance
    { name: "Support", popularity: 99, categories: ["Support & Help", "Guide & Encourage"], color: "#4CAF50" },
    { name: "Help", popularity: 98, categories: ["Support & Help"], color: "#8BC34A" },
    { name: "Assist", popularity: 87, categories: ["Support & Help"], color: "#CDDC39" },
    { name: "Guide", popularity: 85, categories: ["Guide & Encourage"], color: "#FFEB3B" },
    { name: "Encourage", popularity: 84, categories: ["Guide & Encourage"], color: "#FFC107" },
    { name: "Facilitate", popularity: 77, categories: ["Guide & Encourage"], color: "#FF9800" },
    { name: "Mentor", popularity: 82, categories: ["Guide & Encourage", "Leadership"], color: "#FF5722" },
    { name: "Advise", popularity: 80, categories: ["Guide & Encourage"], color: "#795548" },
  
    // Growth & Development
    { name: "Grow", popularity: 92, categories: ["Personal Growth"], color: "#9C27B0" },
    { name: "Improve", popularity: 94, categories: ["Personal Growth", "Achievement"], color: "#673AB7" },
    { name: "Develop", popularity: 91, categories: ["Personal Growth", "Implementation"], color: "#3F51B5" },
    { name: "Progress", popularity: 88, categories: ["Personal Growth", "Adaptation & Learning"], color: "#2196F3" },
    { name: "Adapt", popularity: 90, categories: ["Adaptation & Learning"], color: "#03A9F4" },
    { name: "Learn", popularity: 89, categories: ["Adaptation & Learning"], color: "#00BCD4" },
    { name: "Evolve", popularity: 86, categories: ["Adaptation & Learning", "Personal Growth"], color: "#009688" },
    { name: "Advance", popularity: 87, categories: ["Personal Growth", "Achievement"], color: "#4CAF50" },
  
    // Innovation & Creation
    { name: "Create", popularity: 91, categories: ["Creative Process"], color: "#8BC34A" },
    { name: "Innovate", popularity: 82, categories: ["Creative Process"], color: "#CDDC39" },
    { name: "Design", popularity: 88, categories: ["Creative Process", "Implementation"], color: "#FFEB3B" },
    { name: "Build", popularity: 86, categories: ["Implementation"], color: "#FFC107" },
    { name: "Transform", popularity: 85, categories: ["Implementation", "Creative Process"], color: "#FF9800" },
    { name: "Pioneer", popularity: 83, categories: ["Creative Process"], color: "#FF5722" },
    { name: "Invent", popularity: 81, categories: ["Creative Process"], color: "#795548" },
    { name: "Craft", popularity: 79, categories: ["Implementation"], color: "#9E9E9E" },
  
    // Collaboration & Connection
    { name: "Collaborate", popularity: 88, categories: ["Teamwork"], color: "#607D8B" },
    { name: "Connect", popularity: 86, categories: ["Engagement"], color: "#9C27B0" },
    { name: "Engage", popularity: 89, categories: ["Engagement"], color: "#673AB7" },
    { name: "Partner", popularity: 85, categories: ["Teamwork"], color: "#3F51B5" },
    { name: "Unite", popularity: 84, categories: ["Teamwork"], color: "#2196F3" },
    { name: "Share", popularity: 83, categories: ["Engagement", "Teamwork"], color: "#03A9F4" },
    { name: "Network", popularity: 82, categories: ["Engagement"], color: "#00BCD4" },
    { name: "Cooperate", popularity: 81, categories: ["Teamwork"], color: "#009688" },
  
    // Achievement & Leadership
    { name: "Lead", popularity: 96, categories: ["Leadership"], color: "#4CAF50" },
    { name: "Achieve", popularity: 95, categories: ["Achievement"], color: "#8BC34A" },
    { name: "Excel", popularity: 93, categories: ["Achievement"], color: "#CDDC39" },
    { name: "Succeed", popularity: 92, categories: ["Achievement"], color: "#FFEB3B" },
    { name: "Motivate", popularity: 86, categories: ["Leadership"], color: "#FFC107" },
    { name: "Empower", popularity: 78, categories: ["Leadership"], color: "#FF9800" },
    { name: "Inspire", popularity: 89, categories: ["Leadership"], color: "#FF5722" },
    { name: "Influence", popularity: 87, categories: ["Leadership"], color: "#795548" },
  
    // Conflict & Opposition
    { name: "Argue", popularity: 72, categories: ["Direct Conflict"], color: "#F44336" },
    { name: "Fight", popularity: 75, categories: ["Direct Conflict"], color: "#E91E63" },
    { name: "Oppose", popularity: 73, categories: ["Direct Conflict", "Resistance"], color: "#9C27B0" },
    { name: "Resist", popularity: 75, categories: ["Resistance"], color: "#673AB7" },
    { name: "Disagree", popularity: 75, categories: ["Resistance"], color: "#3F51B5" },
    { name: "Challenge", popularity: 74, categories: ["Resistance", "Direct Conflict"], color: "#2196F3" },
    { name: "Confront", popularity: 71, categories: ["Direct Conflict"], color: "#03A9F4" },
    { name: "Debate", popularity: 76, categories: ["Resistance"], color: "#00BCD4" },
  
    // Obstruction & Hindrance
    { name: "Block", popularity: 79, categories: ["Active Obstruction"], color: "#009688" },
    { name: "Prevent", popularity: 77, categories: ["Active Obstruction"], color: "#4CAF50" },
    { name: "Interrupt", popularity: 85, categories: ["Active Obstruction"], color: "#8BC34A" },
    { name: "Obstruct", popularity: 76, categories: ["Active Obstruction", "Passive Hindrance"], color: "#CDDC39" },
    { name: "Hinder", popularity: 75, categories: ["Passive Hindrance"], color: "#FFEB3B" },
    { name: "Restrict", popularity: 74, categories: ["Passive Hindrance"], color: "#FFC107" },
    { name: "Impede", popularity: 73, categories: ["Passive Hindrance"], color: "#FF9800" },
    { name: "Delay", popularity: 78, categories: ["Passive Hindrance"], color: "#FF5722" },
  
    // Evasion & Avoidance
    { name: "Avoid", popularity: 74, categories: ["Active Evasion"], color: "#795548" },
    { name: "Ignore", popularity: 90, categories: ["Passive Avoidance"], color: "#9E9E9E" },
    { name: "Withdraw", popularity: 68, categories: ["Active Evasion"], color: "#607D8B" },
    { name: "Evade", popularity: 70, categories: ["Active Evasion"], color: "#F44336" },
    { name: "Deflect", popularity: 69, categories: ["Active Evasion", "Passive Avoidance"], color: "#E91E63" },
    { name: "Withhold", popularity: 69, categories: ["Passive Avoidance"], color: "#9C27B0" },
    { name: "Dodge", popularity: 71, categories: ["Active Evasion"], color: "#673AB7" },
    { name: "Escape", popularity: 72, categories: ["Active Evasion"], color: "#3F51B5" },
  
    // Criticism & Rejection
    { name: "Criticize", popularity: 76, categories: ["Criticism"], color: "#2196F3" },
    { name: "Reject", popularity: 82, categories: ["Rejection"], color: "#03A9F4" },
    { name: "Dismiss", popularity: 78, categories: ["Rejection", "Criticism"], color: "#00BCD4" },
    { name: "Disapprove", popularity: 77, categories: ["Criticism"], color: "#009688" },
    { name: "Dislike", popularity: 88, categories: ["Rejection"], color: "#4CAF50" },
    { name: "Condemn", popularity: 75, categories: ["Criticism"], color: "#8BC34A" },
    { name: "Judge", popularity: 79, categories: ["Criticism"], color: "#CDDC39" },
    { name: "Denounce", popularity: 74, categories: ["Criticism", "Rejection"], color: "#FFEB3B" },
  
    // Neglect & Indifference
    { name: "Neglect", popularity: 78, categories: ["Active Neglect"], color: "#FFC107" },
    { name: "Abandon", popularity: 77, categories: ["Active Neglect"], color: "#FF9800" },
    { name: "Ignore", popularity: 90, categories: ["Passive Indifference"], color: "#FF5722" },
    { name: "Disregard", popularity: 76, categories: ["Passive Indifference"], color: "#795548" },
    { name: "Overlook", popularity: 75, categories: ["Passive Indifference"], color: "#9E9E9E" },
    { name: "Dismiss", popularity: 78, categories: ["Active Neglect", "Passive Indifference"], color: "#607D8B" },
    { name: "Forget", popularity: 80, categories: ["Passive Indifference"], color: "#F44336" },
    { name: "Discard", popularity: 74, categories: ["Active Neglect"], color: "#E91E63" },
  
    // Underperformance & Failure
    { name: "Underperform", popularity: 71, categories: ["Underperformance"], color: "#9C27B0" },
    { name: "Fail", popularity: 73, categories: ["Failure"], color: "#673AB7" },
    { name: "Procrastinate", popularity: 70, categories: ["Underperformance"], color: "#3F51B5" },
    { name: "Struggle", popularity: 72, categories: ["Underperformance", "Failure"], color: "#2196F3" },
    { name: "Falter", popularity: 69, categories: ["Failure"], color: "#03A9F4" },
    { name: "Decline", popularity: 71, categories: ["Underperformance"], color: "#00BCD4" },
    { name: "Regress", popularity: 68, categories: ["Underperformance"], color: "#009688" },
    { name: "Deteriorate", popularity: 67, categories: ["Failure"], color: "#4CAF50" },
  ]
  
  const sentimentCategories = {
    positive: [
      {
        name: "Support & Assistance",
        subcategories: ["Support & Help", "Guide & Encourage"],
      },
      {
        name: "Growth & Development",
        subcategories: ["Personal Growth", "Adaptation & Learning"],
      },
      {
        name: "Innovation & Creation",
        subcategories: ["Creative Process", "Implementation"],
      },
      {
        name: "Collaboration & Connection",
        subcategories: ["Teamwork", "Engagement"],
      },
      {
        name: "Achievement & Leadership",
        subcategories: ["Leadership", "Achievement"],
      },
    ],
    negative: [
      {
        name: "Conflict & Opposition",
        subcategories: ["Direct Conflict", "Resistance"],
      },
      {
        name: "Obstruction & Hindrance",
        subcategories: ["Active Obstruction", "Passive Hindrance"],
      },
      {
        name: "Evasion & Avoidance",
        subcategories: ["Active Evasion", "Passive Avoidance"],
      },
      {
        name: "Criticism & Rejection",
        subcategories: ["Criticism", "Rejection"],
      },
      {
        name: "Neglect & Indifference",
        subcategories: ["Active Neglect", "Passive Indifference"],
      },
      {
        name: "Underperformance & Failure",
        subcategories: ["Underperformance", "Failure"],
      },
    ],
  }
  
  const categorizeBySentiment = (verbs: Verb[]) => {
    const categorized: Record<string, Record<string, Record<string, Verb[]>>> = {
      positive: {},
      negative: {},
    }
  
    // Initialize categories and subcategories
    sentimentCategories.positive.forEach((category) => {
      categorized.positive[category.name] = {}
      category.subcategories.forEach((subcategory) => {
        categorized.positive[category.name][subcategory] = []
      })
    })
    sentimentCategories.negative.forEach((category) => {
      categorized.negative[category.name] = {}
      category.subcategories.forEach((subcategory) => {
        categorized.negative[category.name][subcategory] = []
      })
    })
  
    // Group verbs by their categories and subcategories
    verbs.forEach((verb) => {
      const sentiment = verb.categories.some((cat) =>
        sentimentCategories.positive.some((posCategory) => posCategory.subcategories.includes(cat)),
      )
        ? "positive"
        : "negative"
  
      verb.categories.forEach((category) => {
        for (const mainCategory of sentimentCategories[sentiment]) {
          if (mainCategory.subcategories.includes(category)) {
            categorized[sentiment][mainCategory.name][category].push(verb)
            break
          }
        }
      })
    })
  
    return categorized
  }
  
  export { verbData, categorizeBySentiment, sentimentCategories, type Verb }