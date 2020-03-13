String msg = ".... . .-.. .-.. --- / .-- --- .-. .-.. -..///";
int LED = D0;

void setup() {
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:

  for (int i = 0; i < msg.length(); i++) {
    switch (msg[i]) {
      case '.':
        digitalWrite(LED, LOW);
        delay (50);
        digitalWrite(LED, HIGH);
        delay (50);
        break;

      case '-':
        digitalWrite(LED, LOW);
        delay (100);
        digitalWrite(LED, HIGH);
        delay (50);
        break;

      case ' ':
        digitalWrite(LED, HIGH);
        delay (100);
        break;

      case '/':
        digitalWrite(LED, HIGH);
        delay (200);
        break;
    }
  }
}
