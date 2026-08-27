/* 
 * Credits to all sources on Google, acting as reference to this  code below. This code is not 
 * TechValer's own creation. TechValer has referred  to different projects and websites to 
 * find an easy code for beginners to  get started with Temperature & Humidity sensor(DHT11/DHT22) 
 * and Arduino.  TechValer does not claim this code to be its own. TechValer is greatly thankful  
 * for original creaters of this code and also all others who acted as reference.  
 */

/* 
 *  About TechValer
 *  
 *  What comes to mind when  you think of tech...hmm, we're sure youre thinking of iPhone, 
 *  Alexa, Boston  Dynamics robotic dog etc., at least thats what we would have thought of. 
 *  Our point here is, when you look inside this tech...you'll find weird boards with  
 *  components attached to it. This stuff is electronics and we at Techvaler  deeply appreciate 
 *  this piece of tech. As the name suggests, we are Tech  Enthusiasts who know the Worth and 
 *  Potential of these amazing tech stuff!  So, check out our website techvaler.com and Youtube channel: "Techcafe" to find  out 
 *  more.
 */

/* 
 *  Note: Any model of Arduino can be used  for this project. Just keep in mind the digital pins.
 *  The readings available  in the serial monitor are almost accurate.
 *  Refer to the documentation for  better understanding of this particular code and project.
 */

/*
 *  Thanks to Drona Automations Pvt.Ltd for Sponsoring this project!
 */

#include  "DHT.h" //It is necessary for us to include this library when we use DHT11/DHT22  sensor
#define DHTPIN 3 // Defining the data output pin to Arduino
#define  DHTTYPE DHT11 // Specify the sensor type(DHT11 or DHT22)

DHT dht(DHTPIN,  DHTTYPE); //Declaration for varibles below...

void setup() {
  Serial.begin(9600);  //To engage serial monitor
  dht.begin(); //To initialise DHT sensor
}

void  loop() {
  delay(1000);
  //Here h= Humidity; tC= Temperature in degree C;  tF= Temperature in degree F
  float h= dht.readHumidity();
  float tC= dht.readTemperature();
  float tF= dht.readTemperature(true);

  if (isnan(h) || isnan(tC) || isnan(tF)){
    Serial.println("Failed to read the DHT sensor. Check connections");
    }
  else{
    Serial.print("Humidity: ");
    Serial.print(h);
    Serial.print("%");
    Serial.print("  ||  ");
    Serial.print("Temperature: ");
    Serial.print(tC);
    Serial.print("C  ");
    Serial.print(tF);
    Serial.println("F");  
    }
}    
