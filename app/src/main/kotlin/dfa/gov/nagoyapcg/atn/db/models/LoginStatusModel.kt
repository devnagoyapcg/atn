package dfa.gov.nagoyapcg.atn.db.models

import dfa.gov.nagoyapcg.atn.webservices.AuthService
import spark.Session

data class LoginStatusModel(
    var ip: String = "",
    var user: String = "",
    var level: AuthService.Level = AuthService.Level.GUEST,
    var session: Session? = null
) {
    fun toMap(): Map<String, Any?> {
        return mapOf(
            "ip" to ip,
            "user" to user,
            "level" to level,
            "session" to session
        )
    }
}