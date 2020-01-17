
package main

import (
	"encoding/json"
  "fmt"
  "net/http"
  "os"
  
  "github.com/gorilla/mux"
)

const (
  PORT = ":8585"
)

type options struct {
	User   string `json:"dbUser"`
	Pass   string `json:"dbPass"`
	Name   string `json:"dbName"`
	Host   string `json:"dbHost"`
	Port   string `json:"dbPort"`
	PcName string `json:"pcName"`
  Cert   string `json:"cert"`
  PrivKey string `json:"priv_key"`
}

var opts options

func getConfigurationAndSetDBCredentials() {
	file, _ := os.Open("conf.json")
	defer file.Close()
	decoder := json.NewDecoder(file)
	err := decoder.Decode(&opts)
	if err != nil {
		fmt.Println("error:", err)
	}
}

func main() {

	getConfigurationAndSetDBCredentials()
	rtr := mux.NewRouter()

	//GETs
	//rtr.HandleFunc(SERVICE_PATH+"/quests", handleQuests).Methods("GET")
	//rtr.HandleFunc(SERVICE_PATH + "/quests", validationMiddleware(API.FetchQuests)).Methods("GET", "OPTIONS")
	
	rtr.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("static/"))))
	http.Handle("/", rtr)

	host, _ := os.Hostname()
  fmt.Println(host, opts)
	if host != opts.PcName {
		fmt.Println("listening on encrypted " + PORT)
		http.ListenAndServeTLS(PORT, opts.Cert, opts.PrivKey, rtr)
	} else {
		fmt.Println("listening on non-SSL " + PORT)
		http.ListenAndServe(PORT, rtr)
	}
}