// Track daily hint usage
export function getHintsUsedToday() {
    const today = new Date().toISOString().split("T")[0];
    const data = JSON.parse(localStorage.getItem("hintUsage") || "{}");
    return data[today] || 0;
  }
  
  export function useHint() {
    const today = new Date().toISOString().split("T")[0];
    const data = JSON.parse(localStorage.getItem("hintUsage") || "{}");
  
    data[today] = (data[today] || 0) + 1;
    localStorage.setItem("hintUsage", JSON.stringify(data));
  }
  
  export function hintsRemaining(limit = 3) {
    return limit - getHintsUsedToday();
  }

  export function generateHint(puzzle, level) {
    switch (puzzle.type) {
  
      case "matrix":
        if (level === 1) return "Look at how numbers increase across rows.";
        if (level === 2) return "Each step adds the same value.";
        return "Find the constant difference.";
  
      case "sequence":
        if (level === 1) return "Check how the numbers change.";
        if (level === 2) return "The difference is consistent.";
        return "Apply that same step again.";
  
      case "odd":
        if (level === 1) return "Check divisibility.";
        if (level === 2) return "Most numbers share a factor.";
        return "One number breaks the pattern.";
  
      case "chain":
        if (level === 1) return "Solve step by step.";
        if (level === 2) return "Follow the operations carefully.";
        return "Don't skip intermediate values.";
  
      case "logicTF":
        if (level === 1) return "Read statements carefully.";
        if (level === 2) return "Not all subsets imply the same property.";
        return "Conclusion is not guaranteed.";
  
      default:
        if (level === 1) return "Break the problem into smaller parts.";
        if (level === 2) return "Look for patterns.";
        return "You're very close.";
    }
  }
  