
package main

import (
	"encoding/json"
  "fmt"
  "io"
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

func redirect(w http.ResponseWriter, req *http.Request) {
  // remove/add not default ports from req.Host
  target := "https://" + req.Host + req.URL.Path 
  if len(req.URL.RawQuery) > 0 {
    target += "?" + req.URL.RawQuery
  }
  fmt.Printf("redirect to: %s", target)
  http.Redirect(w, req, target, http.StatusTemporaryRedirect)
}

func serveResume(w http.ResponseWriter, req *http.Request) {
  fmt.Println("serving resume");
  host, _ := os.Hostname()
  filename := "C:\\Go\\work\\src\\jface\\jjf.im\\static\\media\\resume.pdf"
  if host != opts.PcName {
    filename = "/var/www/html/jjf.im/static/media/resume.pdf"
  }
  f, err := os.Open(filename)
  if err != nil {
    fmt.Println(err)
    w.WriteHeader(500)
    return
  }
  defer f.Close()

  //Set header
  w.Header().Set("Content-type", "application/pdf")

  //Stream to response
  if _, err := io.Copy(w, f); err != nil {
    fmt.Println(err)
    w.WriteHeader(500)
  }
}

func main() {

	getConfigurationAndSetDBCredentials()
	rtr := mux.NewRouter()

	//GETs
	//rtr.HandleFunc(SERVICE_PATH+"/quests", handleQuests).Methods("GET")
	//rtr.HandleFunc(SERVICE_PATH + "/quests", validationMiddleware(API.FetchQuests)).Methods("GET", "OPTIONS")
	rtr.HandleFunc("/resume.pdf", serveResume).Methods("GET")
  rtr.HandleFunc("/resume", serveResume).Methods("GET")
  rtr.HandleFunc("/resume/", serveResume).Methods("GET")
	rtr.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("static/"))))
	http.Handle("/", rtr)

	host, _ := os.Hostname()
  fmt.Println(host, opts)
	if host != opts.PcName {
    //go http.ListenAndServe(PORT, http.HandlerFunc(redirect))
		fmt.Println("listening on encrypted " + PORT)
    cert := "/etc/letsencrypt/live/jjf.im/fullchain.pem"
		prv_key := "/etc/letsencrypt/live/jjf.im/privkey.pem"
		http.ListenAndServeTLS(PORT, cert, prv_key, rtr)
	} else {
		fmt.Println("listening on non-SSL " + PORT)
		http.ListenAndServe(PORT, rtr)
	}
}