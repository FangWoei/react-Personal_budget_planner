import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { BsTrash } from "react-icons/bs";

export default function Expenses() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);


  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expenses"));
    if (expenses) {
      setExpenseList(expenses);
    }
  }, []);

  const addExpense = () => {
    const newExpenseList = [...expenseList];

    if (title && amount) {
      newExpenseList.push({
        id: nanoid(),
        title: title,
        amount: parseInt(amount),
      });

      setExpenseList(newExpenseList);
      localStorage.setItem("expenses", JSON.stringify(newExpenseList));

      setTitle("");
      setAmount(0);
    } else {
      alert("Please insert your expense");
    }
  };

  const deleteExpense = (id) => {
    const newExpenseList = expenseList.filter((e) => e.id !== id);
    setExpenseList(newExpenseList);
    localStorage.setItem("expense", JSON.stringify(newExpenseList));
  };

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      expenseList.forEach((e) => {
        newCheckedList.push(e.id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);

    }
  };

  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((e) => e !== id);
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    const newExpenseList = expenseList.filter((e) => {
      if (checkedList && checkedList.includes(e.id)) {
        return false;
      }
      return true;
    });
    setExpenseList(newExpenseList);
    localStorage.setItem("expenses", JSON.stringify(newExpenseList));
    setCheckAll(false);

  };

  const calculateTotal = () => {
    let total = 0;
    expenseList.forEach((e) => {
      total += parseInt(e.amount);
    });
    return total;
  };
  return (
    <div
      className="container mt-5 mx-auto"
      style={{
        maxWidth: "800px",
      }}
    >
      <Card>
        <Card.Body>
          <Card.Title>Expense</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    disabled={
                      expenseList && expenseList.length > 0 ? false : true
                    }
                    onChange={(event) => {
                      checkBoxAll(event);
                    }}
                  />
                </th>
                <th>Source</th>
                <th>Amount</th>
                <th>
                  Actions
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    disabled={
                      checkedList && checkedList.length > 0 ? false : true
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      deleteCheckedItems();
                    }}
                  >
                    <BsTrash />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {expenseList.length > 0 ? (
                expenseList.map((e) => {
                  return (
                    <tr key={e.id}>
                      <td>
                        <Form.Check
                          checked={
                            checkedList && checkedList.includes(e.id)
                              ? true
                              : false
                          }
                          type="checkbox"
                          onChange={(event) => {
                            checkboxOne(event, e.id);
                          }}
                        />
                      </td>
                      <td>{e.title}</td>
                      <td>${e.amount}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(event) => {
                            event.preventDefault();
                            deleteExpense(e.id);
                          }}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No expense added yet.</td>
                </tr>
              )}
              <tr>
                <td>Total</td>
                <td>${calculateTotal()}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
          <Form>
            <Form.Group className="mb-1 mt-2">
              <Form.Control
                type="text"
                placeholder="Type your expense here..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control
                type="number"
                placeholder="Type your amount here..."
                value={amount}
                min={0}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                addExpense();
              }}
            >
              Add New
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Link to="/" className="pt-2 text-center">
        Go back to Dashboard
      </Link>
    </div>
  );
}
