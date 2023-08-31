import { Stack, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { BudgetCard } from "./components/BudgetCard";
import { AddBudgetModal } from "./components/AddBudgetModal";
import { ViewExpensesModal } from "./components/ViewExpensesModal";
import { useState } from "react";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext";
import { AddExpenseModal } from "./components/AddExpenseModal";
import { UncategorizedBudgetCard } from "./components/UncategorizedBudgetCard";
import { TotalBudgetCard } from "./components/TotalBudgetCard";

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false);
  const [showAddExpenseModal, setShowAddExpenseModal] =
    useState<boolean>(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<
    null | string
  >(null);
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] =
    useState<string>("");
  const { budgets, getBudgetExpenses } = useBudgets();

  function openAddExpenseModal(budgetId: string) {
    setShowAddExpenseModal(!showAddExpenseModal);
    setAddExpenseModalBudgetId(budgetId);
  }

  return (
    <>
      <Container className="my-4">
        <Stack direction="horizontal" gap={2} className="mb-4">
          <h1 className="me-auto">Budgets</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => setShowAddExpenseModal(true)}
          >
            Add Expense
          </Button>
        </Stack>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start"
          }}
        >
          {budgets.map((budget) => {
            const amount = getBudgetExpenses(budget.id).reduce(
              (total, expense) => total + expense.amount,
              0
            );
            return (
              <>
                <BudgetCard
                  key={budget.id}
                  name={budget.name}
                  amount={amount}
                  max={budget.max}
                  gray
                  onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                  onViewExpenseClick={() =>
                    setViewExpensesModalBudgetId(budget.id)
                  }
                />
              </>
            );
          })}
          <UncategorizedBudgetCard
            onAddExpenseClick={() =>
              openAddExpenseModal(UNCATEGORIZED_BUDGET_ID)
            }
            onViewExpenseClick={() =>
              setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
            }
          />
          <TotalBudgetCard />
        </div>
      </Container>
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        handleClose={() => {
          setShowAddExpenseModal(false);
          setAddExpenseModalBudgetId(""); // Shifting to the default, uncategorised user
        }}
        defaultBudgetId={addExpenseModalBudgetId}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId(null)}
      />
    </>
  );
}

export default App;
