import com.aleinin.goty.properties.GotyQuestion
import java.time.ZoneId
import java.time.ZonedDateTime

data class PropertiesUpdateRequest(
    val searchYears: List<Int>?,
    val title: String,
    val gotyQuestion: GotyQuestion,
    val tiePoints: List<Int>,
    val deadline: ZonedDateTime,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
    val defaultLocalTimeZone: ZoneId?
) {
    init {
        require(tiePoints.isNotEmpty()) { "tiePoints must not be empty" }
        require(tiePoints.sortedDescending() == tiePoints) { "tiePoints must be in descending order"}
    }
}