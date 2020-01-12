package alphatex;

public class Pair<T> {
    String attribute;
    T value;
    Pair(String attribute, T value) {
        this.attribute = attribute;
        this.value = value;
    }

    Pair(Pair<T> other) {
        this.attribute = other.attribute;
        this.value = other.value;
    }

    public void copy(Pair<T> source) {
        this.attribute = source.attribute;
        this.value = source.value;
    }

    public T getValue() {
        return this.value;
    }

    @Override
    public String toString() {
        return attribute + " " + value.toString();
    }
}
