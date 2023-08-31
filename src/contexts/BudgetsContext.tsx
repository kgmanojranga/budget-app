/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext } from "react";
import { v4 as uuidV4 } from "uuid";

import useLocalStorage from "../hooks/useLocalStorage";

type BudgetsProviderProps = {
  children: ReactNode;
};

type BudgetItem = {
  id: string;
  name: string;
  max: number;
};

type ExpenseItem = {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
};

type AddBudgetProps = {
  name: string;
  max: number;
};

type AddExpenseProps = {
  amount: number;
  description: string;
  budgetId: string;
};

type BudgetsContext = {
  budgets: BudgetItem[];
  expenses: ExpenseItem[];
  getBudgetExpenses: (budgetId: string | null) => ExpenseItem[];
  addExpenses: ({ amount, description, budgetId }: AddExpenseProps) => void;
  addBudget: ({ name, max }: AddBudgetProps) => void;
  deleteBudget: (id: string) => void;
  deleteExpense: (id: string) => void;
};

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized";

const BudgetsContext = createContext({} as BudgetsContext);

export function useBudgets() {
  return useContext(BudgetsContext);
}

export const BudgetsProvider = ({ children }: BudgetsProviderProps) => {
  const [budgets, setBudgets] = useLocalStorage<BudgetItem[]>("budgets", []);
  const [expenses, setExpenses] = useLocalStorage<ExpenseItem[]>(
    "expenses",
    []
  );

  function getBudgetExpenses(budgetId: string | null) {
    return expenses.filter((expenses) => expenses.budgetId === budgetId);
  }

  function addExpenses({ amount, description, budgetId }: AddExpenseProps) {
    setExpenses((prevExpenses) => {
      return [...prevExpenses, { id: uuidV4(), amount, description, budgetId }];
    });
  }

  function addBudget({ name, max }: AddBudgetProps) {
    setBudgets((prevBudgets) => {
      if (prevBudgets.find((budget) => budget.name === name)) {
        return prevBudgets;
      }
      return [...prevBudgets, { id: uuidV4(), name, max }];
    });
  }

  function deleteBudget(id: string) {
    setExpenses((prevExpenses) => {
      return prevExpenses.map((expense) => {
        if (expense.budgetId === id) return expense;
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
      });
    });
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== id)
    );
  }

  function deleteExpense(id: string) {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  }

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpenses,
        addBudget,
        deleteBudget,
        deleteExpense
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};
