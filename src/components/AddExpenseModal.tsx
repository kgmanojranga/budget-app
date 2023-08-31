import { useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import {
  UNCATEGORIZED_BUDGET_ID,
  useBudgets
} from "../contexts/BudgetsContext";

type AddExpenseModalProps = {
  show: boolean;
  handleClose: () => void;
  defaultBudgetId: string;
};
export function AddExpenseModal({
  show,
  handleClose,
  defaultBudgetId
}: AddExpenseModalProps) {
  // console.log(defaultBudgetId);
  const { addExpenses, budgets } = useBudgets();
  const descriptionRef = useRef<HTMLInputElement>(null);
  const budgetIdRef = useRef<HTMLSelectElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(e);
    addExpenses({
      description: descriptionRef?.current?.value || "",
      amount: parseFloat(amountRef?.current?.value || ""),
      budgetId: budgetIdRef?.current?.value || ""
    });
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Header closeButton>
          <Modal.Title>New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" required ref={descriptionRef} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              required
              min={0}
              step={0.01}
              ref={amountRef}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="budgetId">
            <Form.Label>Budget</Form.Label>
            <Form.Select defaultValue={defaultBudgetId} ref={budgetIdRef}>
              <option id={UNCATEGORIZED_BUDGET_ID}>Uncategorized</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
