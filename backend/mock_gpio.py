class MockGPIO:
    BCM = "BCM"
    OUT = "OUT"
    HIGH = "HIGH"
    LOW = "LOW"

    def setmode(self, mode):
        print(f"Mock setmode({mode})")

    def setup(self, channel, mode):
        print(f"Mock setup({channel}, {mode})")

    def output(self, channel, state):
        print(f"Mock output({channel}, {state})")

    def cleanup(self):
        print("Mock cleanup()")

GPIO = MockGPIO()