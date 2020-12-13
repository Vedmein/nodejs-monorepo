import React from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';

export class GiveKarmaCard extends React.Component<
  { sendEvent: (eventType: string, data: unknown, message?: string) => void },
  { amount: number }
> {
  state = { amount: 10 };

  earnKarma() {
    this.props.sendEvent('earnKarma', { amount: this.state.amount, notify: true });
  }

  render() {
    return (
      <Card body={false}>
        <Card.Header>Начисление кармы</Card.Header>
        <Card.Body>
          <InputGroup>
            <FormControl type="number" value={this.state.amount} onChange={(e) => this.setState({ amount: Number(e.target.value) })} />
            <InputGroup.Append>
              <Button variant="success" onClick={() => this.earnKarma()}>
                Начислить
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Card.Body>
      </Card>
    );
  }
}
