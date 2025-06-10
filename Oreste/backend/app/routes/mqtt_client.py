import paho.mqtt.client as mqtt
import time

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to MQTT Broker!")
        client.subscribe("soldier/data")
    else:
        print(f"❌ Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    print(f"📥 Topic: {msg.topic} | Message: {msg.payload.decode()}")

client = mqtt.Client()

# Optional:
# client.username_pw_set("user", "pass")

client.on_connect = on_connect
client.on_message = on_message

print("🔌 Connecting to broker...")
client.connect("172.16.0.101", 1884, 60)

client.loop_start()
time.sleep(5)  # Wait to see connection status
client.loop_stop()
